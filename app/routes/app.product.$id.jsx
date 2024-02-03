import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import * as P from '@shopify/polaris';

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const url = new URL(request.url);

  const product = await admin.rest.resources.Product.find({
    session: session,
    id: Number(url.pathname.replace("/app/product/", "")),
  });

  return product;
};

export default function Product() {
  const loaderData = useLoaderData();
  console.log("loaderData", loaderData);

  return (
    <P.Form>
      <P.Page
        backAction={{ content: 'Products', url: '/app' }}
        title={loaderData.title}
        titleMetadata={<P.Badge tone="success">{loaderData.status.charAt(0).toUpperCase() + loaderData.status.slice(1)}</P.Badge>}
        compactTitle
        secondaryActions={[
          {
            content: 'Preview',
            onAction: () => window.open(`https://test-store-2023-23.myshopify.com/products/${loaderData.handle}`),
          }
        ]}
        actionGroups={[
        ]}
        pagination={{
          hasPrevious: true,
          hasNext: true,
        }}
      >
        <P.Layout>
          <P.Layout.Section>
            <P.LegacyCard sectioned>
              <P.BlockStack gap="500">
                <P.FormLayout>
                  <P.TextField
                    label="Title"
                    value={loaderData.title}
                  />
                  <P.TextField
                    label="Description"
                    multiline={6}
                    value={loaderData.body_html}
                  />
                </P.FormLayout>
              </P.BlockStack>
            </P.LegacyCard>
          </P.Layout.Section>
          <P.Layout.Section variant="oneThird">
            <P.LegacyCard title="Status" sectioned>
              <P.Select
                options={
                  [
                    { label: loaderData.status.charAt(0).toUpperCase() + loaderData.status.slice(1), value: loaderData.status }
                  ]
                }
                value={loaderData.status}
              />
            </P.LegacyCard>
          </P.Layout.Section>
        </P.Layout>

        <br />

        <P.Layout>
          <P.Layout.Section>
            <P.LegacyCard sectioned title="Media">
              {
                loaderData.images.map((image, index) => {
                  return <img key={index} src={image.src} alt="" width={100} height={100} />
                })
              }
            </P.LegacyCard>
          </P.Layout.Section>
          <P.Layout.Section variant="oneThird">
            <P.LegacyCard title="Product organization" sectioned>
              <P.BlockStack gap="500">
                <P.FormLayout>
                  <P.TextField
                    label="Product category"
                    value={loaderData.title}
                  />
                  <P.TextField
                    label="Product type"
                    value={loaderData.product_type}
                  />
                  <P.TextField
                    label="Vendor"
                    value={loaderData.vendor}
                  />
                  <P.TextField
                    label="Tags"
                    value={loaderData.tags.replaceAll(",", " |")}
                  />
                </P.FormLayout>
              </P.BlockStack>
            </P.LegacyCard>
          </P.Layout.Section>
        </P.Layout>

        <br />

        <P.Layout>
          <P.Layout.Section>
            <P.LegacyCard sectioned title="Variants">
              <P.Card roundedAbove="sm">
                <P.Bleed marginBlockEnd="400" marginInline="400">
                  <P.Box background="bg-surface-secondary" padding="400">
                    <P.BlockStack gap="200">
                      {
                        loaderData.options.map((option, index) => {
                          return <>
                            <P.Text as="h3" key={index} variant="headingSm" fontWeight="medium">
                              {option.name}
                            </P.Text>
                            <P.List>
                              {
                                option.values.map((value, index) => {
                                  return <P.List.Item key={index}>{value}</P.List.Item>
                                })
                              }
                            </P.List>
                          </>
                        })
                      }
                    </P.BlockStack>
                  </P.Box>
                </P.Bleed>
              </P.Card>
            </P.LegacyCard>
          </P.Layout.Section>
          <P.Layout.Section variant="oneThird">
          </P.Layout.Section>
        </P.Layout>

        <P.Layout>
          <P.Layout.Section>
            <P.Card>
              {
                loaderData.variants.map((variant, index) => {
                  return <P.Text key={index}>{variant.title}</P.Text>
                })
              }
            </P.Card>
          </P.Layout.Section>
          <P.Layout.Section variant="oneThird">
          </P.Layout.Section>
        </P.Layout>
      </P.Page>
    </P.Form>
  )
}