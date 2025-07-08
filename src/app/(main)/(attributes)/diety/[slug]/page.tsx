import AttributePage from "@/modules/attributes/ui/views/attribute-view";
import { SearchParams } from "nuqs";
import { generateAttributeMetadata } from "../../utils";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug } = await params;
  return generateAttributeMetadata(slug);
};

const DietPage = async ({ params, searchParams }: PageProps) => {
  return (
    <AttributePage
      params={params}
      searchParams={searchParams}
      attributeType="diets"
    />
  );
};

export default DietPage;
