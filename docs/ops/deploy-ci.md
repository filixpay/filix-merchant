# filix-merchant CI 部署

构建在 **GitHub Actions** 完成，生产机 **直接拉取公开 GHCR 镜像并重启容器**，无需 GHCR 登录凭证。

---

## 流程

```text
git push main
  → GitHub Actions: docker build → push ghcr.io/filixpay/filix-merchant
  → server: ./scripts/deploy-pull.sh
```

镜像包为公开仓库发布，服务器 `docker pull` 不需要登录凭证。

> 若 `docker pull` 报 `not found`，通常是 **GitHub Actions 尚未成功推送镜像**（见下方「镜像推送一次性配置」），不是服务器配置问题。

---

## 镜像推送一次性配置（GitHub 仓库管理员）

Docker Publish 失败且日志含 `denied: permission_denied: write_package` 时，说明 **镜像已构建成功，但没有权限写入 GHCR**。按顺序做：

1. 打开仓库 **Settings → Actions → General**  
   → **Workflow permissions** → 选 **Read and write permissions**  
   → 勾选 **Allow GitHub Actions to create and approve pull requests**（可选）  
   → **Save**
2. 若仓库曾用别的账号推过同名包，或仍报 `write_package`：  
   用 `filixpay` 账号创建 Classic PAT（勾选 `write:packages` + `read:packages`）  
   → 仓库 **Settings → Secrets and variables → Actions** → New secret  
   → Name: `GHCR_TOKEN`，Value: 该 PAT
3. **Actions → Docker Publish → Run workflow** 手动重跑，确认变绿
4. 首次推送成功后：  
   [Packages → filix-merchant](https://github.com/users/filixpay/packages/container/package/filix-merchant)  
   → **Package settings** → **Change visibility** → **Public**  
   （公开后服务器才能匿名 `docker pull`，无需登录）

说明：`GHCR_TOKEN` 仅给 **CI 推镜像** 用；服务器部署仍不需要 token。

---

## 一次性配置（服务器）

### 1. Clone 项目

```bash
git clone https://github.com/filixpay/filix-merchant.git
cd filix-merchant
```

### 2. 准备运行时配置

```bash
cp .env.example .env.prod
chmod 600 .env.prod
```

编辑 `.env.prod`，填入你的 OIDC、站点 URL 等配置（参考 `.env.example`）。此文件不要提交 git。

### 3. 首次部署

```bash
chmod +x scripts/deploy-pull.sh   # 若 git 未保留可执行位
./scripts/deploy-pull.sh
# 或直接：bash scripts/deploy-pull.sh
```

---

## 日常部署

```bash
cd ~/filix-merchant
git pull
./scripts/deploy-pull.sh
```

若镜像版本未变化，脚本会自动跳过重启。

---

## 指定版本 / 回滚

```bash
MERCHANT_IMAGE=ghcr.io/filixpay/filix-merchant:<commit-sha> ./scripts/deploy-pull.sh
```

---

## 可选参数

| 环境变量 | 默认值 | 说明 |
|---------|--------|------|
| `MERCHANT_IMAGE` | `ghcr.io/filixpay/filix-merchant:latest` | 镜像地址 |
| `MERCHANT_CONTAINER` | `filix-merchant` | 容器名 |
| `PORT_HOST` | `3000` | 宿主机端口 |
| `RUNTIME_ENV_FILE` | `.env.prod` | 运行时 env 文件 |

---

## 部署后检查

```bash
docker ps --filter name=filix-merchant
docker logs -f filix-merchant --tail 50
curl -I http://127.0.0.1:3000/en
```

---

## 镜像拉取失败（not found）

```bash
# 1. 确认 GitHub Actions「Docker Publish」已成功（绿色 ✓）
# 2. 确认 GHCR 包已设为 Public
# 3. 再执行
./scripts/deploy-pull.sh
```

**临时方案（在服务器本地构建，不依赖 GHCR）：**

```bash
cd ~/filix-merchant
git pull
./docker-build.sh
docker rm -f filix-merchant 2>/dev/null || true
docker run -d --name filix-merchant --restart unless-stopped \
  -p 3000:3000 --env-file .env.prod \
  -e NODE_ENV=production -e PORT=3000 -e HOSTNAME=0.0.0.0 \
  filix-merchant
```

---

## 本地开发（可选）

```bash
./docker-build.sh && ./start-docker.sh
```
