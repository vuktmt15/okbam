import Head from "next/head";
import React from "react";

interface HeaderMetaProps {
  title?: string | undefined;
  description?: string | undefined;
}
function HeaderMeta(props: HeaderMetaProps): JSX.Element {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <meta itemProp="name" content={props.title} />
      <meta itemProp="description" content={props.description} />
    </Head>
  );
}
export default HeaderMeta;
