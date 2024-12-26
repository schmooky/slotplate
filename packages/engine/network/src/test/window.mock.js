const windowMock = {
  location: { href: "https://test.domain", search: "" },
};
//@ts-ignore
global.window = windowMock;
