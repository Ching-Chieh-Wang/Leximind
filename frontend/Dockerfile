# Step 1: Build Stage
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json，并安装依赖
COPY package*.json ./
RUN npm install

# 复制项目文件
COPY . .

# 拷贝 .env 文件到容器中（重要！）
# 如果你不希望 .env 被包含在镜像中，可以在 docker-compose.yml 中加载
COPY .env .env

# 构建 Next.js 应用
RUN npm run build

# Step 2: Production Stage
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 拷贝 builder 阶段的构建成果
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 设置环境变量
ENV PORT 3000
ENV NODE_ENV production

# 暴露端口
EXPOSE 3000

# 启动 Next.js 应用
CMD ["npm", "start"]