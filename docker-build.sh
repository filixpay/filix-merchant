#!/bin/bash

# Local/emergency image build. Production: push main → GHCR, then ./scripts/deploy-pull.sh
# See docs/ops/deploy-ci.md

echo "🔨 开始构建 Docker 镜像 [filix-merchant]..."

# 检查 Dockerfile 是否存在
if [ ! -f "Dockerfile" ]; then
  echo "❌ 错误：当前目录找不到 Dockerfile！"
  exit 1
fi

# 执行构建
# --build-arg PORT=3000: 强制在构建阶段将端口写入镜像内部配置
# -t filix-merchant: 镜像名称统一为 filix-merchant
docker build \
  --build-arg PORT=3000 \
  --build-arg HOSTNAME="0.0.0.0" \
  -t filix-merchant \
  .

if [ $? -eq 0 ]; then
  echo "✅ 镜像构建成功！名称：filix-merchant"
  echo "💡 接下来请运行 ./start-docker.sh 来启动服务"
else
  echo "❌ 镜像构建失败，请检查上方报错信息。"
  exit 1
fi