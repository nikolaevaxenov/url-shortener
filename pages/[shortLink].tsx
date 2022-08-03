import type { GetServerSideProps, NextPage } from "next";

const ShortLinkRedirect: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const shortLink = context?.params?.shortLink;

  const res = await fetch(`${process.env.APP_URL}/api/links/${shortLink}`, {
    method: "get",
  });

  const result = await res.json();

  if (result !== null) {
    const vres = await fetch(`${process.env.APP_URL}/api/links/${shortLink}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ views: result.views + 1 }),
    });

    const vresult = await vres.json();
  }

  return {
    redirect: {
      destination: result.fullLink ?? "/",
      permanent: false,
    },
  };
};

export default ShortLinkRedirect;
