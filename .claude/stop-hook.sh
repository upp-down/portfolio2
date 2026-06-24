#!/bin/bash
# Claude Code Stop Hook — 交付验收守卫
# 规则：如果本轮改了代码/配置/文档，但没有验证结果，不允许结束。
# 退出码 0 = 允许结束，非 0 = 阻止结束并注入反馈。

INPUT=$(cat)

# 检测是否发生了文件变更（Write/Edit/MultiEdit 工具调用）
CHANGED=$(echo "$INPUT" | grep -oE '"(Write|Edit|MultiEdit)"' | head -1)

# 无变更 → 允许结束
if [ -z "$CHANGED" ]; then
  exit 0
fi

# 检测是否已有验证行为（宽松匹配常见验证关键词）
VERIFIED=$(echo "$INPUT" | grep -ioE '(test|lint|typecheck|type-check|build|验证|功能验证|运行测试|npm (run |)test|pytest|cargo test|go test|jest|vitest|eslint|prettier --check|tsc --noEmit|已验证|验证通过|测试通过|测试结果|all .* pass|PASS|✓|✅)' | head -1)

if [ -n "$VERIFIED" ]; then
  exit 0
fi

# 有变更但无验证 → 阻止结束，注入反馈
cat <<'EOF'
[Stop Hook] 检测到本轮修改了文件，但未找到验证记录。

请继续完成以下至少一项验证后再结束：
1. 运行相关测试（npm test / pytest / 等）
2. 运行 lint 检查（eslint / prettier --check / 等）
3. 运行类型检查（tsc --noEmit / mypy / 等）
4. 运行构建验证（npm run build / 等）
5. 手动验证功能并说明结果

如果本轮修改不影响功能（如注释、文档格式、README），请明确说明"本次修改仅涉及非功能变更，无需验证"。
EOF

exit 2
