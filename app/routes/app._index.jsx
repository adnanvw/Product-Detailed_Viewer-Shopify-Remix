import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit, useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const products = await admin.rest.resources.Product.all({ session });

  return products.data;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    },
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data?.productCreate?.product,
  });
};

export default function Index() {
  const loaderData = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page>
      <ui-title-bar title="Remix app template">
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          {
            loaderData.map((product, index) => {
              return <Layout.Section key={index}>
                <img src={product?.image?.src} width={100} height={100} alt="" />
                <p>{product.title}</p>
                <button onClick={() => redirectToProduct(product.id)}>View product</button>
              </Layout.Section>
            })
          }
        </Layout>
      </BlockStack>
    </Page>
  );

  function redirectToProduct(product_id) {
    return navigate(`/app/product/${product_id}`);
  }
}
