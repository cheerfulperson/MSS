import { CopyOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";

import { useCopyToClipboard } from "hooks/useCopyToClipboard";

export const CopyField = ({ copyText }: { copyText: string }) => {
  const { copy } = useCopyToClipboard();

  return (
    <Space.Compact style={{ width: "100%" }}>
      <Input disabled value={copyText} />
      <Button
        onClick={() => {
          copy(copyText);
        }}
        type="primary"
      >
        <CopyOutlined />
      </Button>
    </Space.Compact>
  );
};
