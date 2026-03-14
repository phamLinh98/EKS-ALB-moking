FROM node:20-alpine

WORKDIR /app

# Copy package files trước (tận dụng Docker layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY index.js .

# Security: chạy với non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
        CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "index.js"]