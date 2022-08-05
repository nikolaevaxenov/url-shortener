import type { GetServerSideProps, NextPage } from "next";
import { getLink, incrementViewsOnLink } from "../services/link";

const ShortLinkRedirect: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const shortLink = context?.params?.shortLink;

  const res = await getLink(shortLink as string, true);

  const result = await res;

  if (result !== null) {
    const vres = await incrementViewsOnLink(shortLink as string, true);

    const vresult = await vres;
  }

  return {
    redirect: {
      destination: result?.fullLink ?? "/",
      permanent: false,
    },
  };
};

export default ShortLinkRedirect;
