"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { App, Button, Card, Empty, Input, Modal, Space, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import {
  CMS_ENTITY_TYPES,
  type CmsEntitySummary,
  type CmsEntityType,
  type CmsLinkRef,
} from "@/lib/api/domains/commerce";
import { searchCmsEntities } from "@/lib/api/domains/commerce/cms";

const TYPE_LABEL_KEY: Record<CmsEntityType, string> = {
  HERITAGE: "cms.types.heritage",
  GEOGRAPHICAL_INDICATION: "cms.types.gi",
  BRAND: "cms.types.brand",
  FOOD: "cms.types.food",
  TOPIC: "cms.types.topic",
};

type ProductCmsLinksSectionProps = {
  accessToken: string | undefined;
  value: CmsLinkRef[];
  onChange: (links: CmsLinkRef[]) => void;
  disabled?: boolean;
};

export default function ProductCmsLinksSection({
  accessToken,
  value,
  onChange,
  disabled = false,
}: ProductCmsLinksSectionProps) {
  const t = useTranslations("CommerceProducts");
  const tCommon = useTranslations("Common");
  const { message } = App.useApp();
  const [pickerType, setPickerType] = useState<CmsEntityType | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CmsEntitySummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [summaries, setSummaries] = useState<Record<string, CmsEntitySummary>>({});

  const selectedKey = useCallback((link: CmsLinkRef) => `${link.type}\0${link.id}`, []);

  useEffect(() => {
    if (!pickerType || !accessToken) {
      return;
    }
    let cancelled = false;
    setSearching(true);
    const timer = window.setTimeout(() => {
      searchCmsEntities(accessToken, { type: pickerType, q: query.trim() || undefined, size: 20 })
        .then((rows) => {
          if (!cancelled) {
            setResults(Array.isArray(rows) ? rows : []);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            message.error(err instanceof Error ? err.message : tCommon("error"));
            setResults([]);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setSearching(false);
          }
        });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [accessToken, pickerType, query, message, tCommon]);

  const byType = useMemo(() => {
    const map = new Map<CmsEntityType, CmsLinkRef[]>();
    for (const type of CMS_ENTITY_TYPES) {
      map.set(type, []);
    }
    for (const link of value) {
      const type = link.type as CmsEntityType;
      if (!map.has(type)) {
        continue;
      }
      map.get(type)!.push(link);
    }
    return map;
  }, [value]);

  const removeLink = (link: CmsLinkRef) => {
    onChange(value.filter((row) => selectedKey(row) !== selectedKey(link)));
  };

  const addLink = (summary: CmsEntitySummary) => {
    const type = String(summary.type) as CmsEntityType;
    const next: CmsLinkRef = { type, id: summary.id };
    if (value.some((row) => selectedKey(row) === selectedKey(next))) {
      setPickerType(null);
      return;
    }
    setSummaries((prev) => ({ ...prev, [selectedKey(next)]: summary }));
    onChange([...value, next]);
    setPickerType(null);
    setQuery("");
  };

  return (
    <Card title={t("cms.title")} style={{ marginTop: 16, marginBottom: 16 }}>
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        {t("cms.hint")}
      </Typography.Paragraph>
      {CMS_ENTITY_TYPES.map((type) => {
        const links = byType.get(type) ?? [];
        return (
          <div key={type} style={{ marginBottom: 16 }}>
            <Space style={{ marginBottom: 8 }} wrap>
              <Typography.Text strong>{t(TYPE_LABEL_KEY[type])}</Typography.Text>
              <Button
                size="small"
                icon={<PlusOutlined />}
                disabled={disabled || !accessToken}
                onClick={() => {
                  setPickerType(type);
                  setQuery("");
                  setResults([]);
                }}
              >
                {t("cms.add")}
              </Button>
            </Space>
            <div>
              {links.length === 0 ? (
                <Typography.Text type="secondary">{t("cms.empty")}</Typography.Text>
              ) : (
                links.map((link) => {
                  const summary = summaries[selectedKey(link)];
                  return (
                    <Tag
                      key={selectedKey(link)}
                      closable={!disabled}
                      onClose={(e) => {
                        e.preventDefault();
                        removeLink(link);
                      }}
                      style={{ marginBottom: 6 }}
                    >
                      {summary?.title || link.id}
                    </Tag>
                  );
                })
              )}
            </div>
          </div>
        );
      })}

      <Modal
        title={pickerType ? t("cms.pickTitle", { type: t(TYPE_LABEL_KEY[pickerType]) }) : t("cms.add")}
        open={pickerType != null}
        onCancel={() => setPickerType(null)}
        footer={null}
        destroyOnClose
      >
        <Input.Search
          allowClear
          placeholder={t("cms.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          loading={searching}
          style={{ marginBottom: 12 }}
        />
        {results.length === 0 && !searching ? (
          <Empty description={t("cms.noResults")} />
        ) : (
          <Space direction="vertical" style={{ width: "100%" }}>
            {results.map((row) => (
              <Button
                key={`${row.type}-${row.id}`}
                type="text"
                block
                style={{ textAlign: "left", height: "auto", whiteSpace: "normal" }}
                onClick={() => addLink(row)}
              >
                <div>
                  <Typography.Text strong>{row.title || row.id}</Typography.Text>
                  {row.summary ? (
                    <div>
                      <Typography.Text type="secondary">{row.summary}</Typography.Text>
                    </div>
                  ) : null}
                </div>
              </Button>
            ))}
          </Space>
        )}
      </Modal>
    </Card>
  );
}
