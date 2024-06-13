import { Flex, Spin } from "antd";

export const AppLoader = () => {
  return (
    <Flex>
      <Spin size="large" tip="iHomeMaster">
        <div style={{ padding: 50 }} />
      </Spin>
    </Flex>
  );
};
