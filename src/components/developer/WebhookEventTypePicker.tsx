"use client";

import { useMemo, useState } from "react";
import { Button, Checkbox, Collapse, Flex, Input, Space, Typography } from "antd";
import { useTranslations } from "next-intl";
import {
    WEBHOOK_EVENT_GROUPS,
    WEBHOOK_EVENT_TYPES,
    filterWebhookEventGroups,
} from "./developer-model";

type WebhookEventTypePickerProps = {
    value?: string[];
    onChange?: (value: string[]) => void;
};

export default function WebhookEventTypePicker({
    value = [],
    onChange,
}: WebhookEventTypePickerProps) {
    const t = useTranslations("Developer");
    const [query, setQuery] = useState("");

    const selected = useMemo(() => new Set(value), [value]);
    const groups = useMemo(
        () => filterWebhookEventGroups(WEBHOOK_EVENT_GROUPS, query),
        [query],
    );

    const setSelected = (next: Set<string>) => {
        onChange?.([...next]);
    };

    const toggleEvent = (event: string, checked: boolean) => {
        const next = new Set(selected);
        if (checked) next.add(event);
        else next.delete(event);
        setSelected(next);
    };

    const selectGroup = (events: readonly string[]) => {
        const next = new Set(selected);
        for (const event of events) next.add(event);
        setSelected(next);
    };

    const selectAll = () => setSelected(new Set(WEBHOOK_EVENT_TYPES));
    const clearAll = () => setSelected(new Set());

    return (
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <Flex justify="space-between" align="center" gap={8} wrap="wrap">
                <Input
                    allowClear
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("webhook_event_search_placeholder")}
                    style={{ maxWidth: 280 }}
                />
                <Space size={8}>
                    <Button type="link" size="small" onClick={selectAll} style={{ paddingInline: 0 }}>
                        {t("webhook_event_select_all")}
                    </Button>
                    <Button type="link" size="small" onClick={clearAll} style={{ paddingInline: 0 }}>
                        {t("webhook_event_clear")}
                    </Button>
                </Space>
            </Flex>

            {groups.length === 0 ? (
                <Typography.Text type="secondary">{t("webhook_event_search_empty")}</Typography.Text>
            ) : (
                <Collapse
                    size="small"
                    defaultActiveKey={groups.map((group) => group.key)}
                    items={groups.map((group) => ({
                        key: group.key,
                        label: (
                            <Flex justify="space-between" align="center" gap={8} style={{ width: "100%" }}>
                                <span>{t(`webhook_event_groups.${group.labelKey}`)}</span>
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        selectGroup(group.events);
                                    }}
                                    style={{ paddingInline: 0 }}
                                >
                                    {t("webhook_event_select_group")}
                                </Button>
                            </Flex>
                        ),
                        children: (
                            <Space direction="vertical" size={6}>
                                {group.events.map((event) => (
                                    <Checkbox
                                        key={event}
                                        checked={selected.has(event)}
                                        onChange={(e) => toggleEvent(event, e.target.checked)}
                                    >
                                        <Typography.Text
                                            style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
                                        >
                                            {event}
                                        </Typography.Text>
                                    </Checkbox>
                                ))}
                            </Space>
                        ),
                    }))}
                />
            )}
        </Space>
    );
}
