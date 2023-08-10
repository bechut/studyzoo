import { axiosCallee, MS_APP_INSTANCE } from "./api";

const metadata = [
  {
    root: "mission",
    instance: MS_APP_INSTANCE,
    child: [
      {
        method: axiosCallee("get"),
        uri: "mission",
        name: "get-all",
      },
      {
        method: axiosCallee("post"),
        uri: "mission",
        name: "create",
      },
    ],
  },
];

export default metadata;