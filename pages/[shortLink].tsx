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
  console.log("Result = ", result);

  return {
    redirect: {
      destination: result.fullLink ?? "/",
      permanent: false,
    },
  };
};

export default ShortLinkRedirect;
