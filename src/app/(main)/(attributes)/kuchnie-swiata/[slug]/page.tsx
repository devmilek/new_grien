import AttributePage from "@/modules/attributes/ui/views/attribute-view";
import { SearchParams } from "nuqs";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

const CuisinePage = async ({ params, searchParams }: PageProps) => {
  return (
    <AttributePage
      params={params}
      searchParams={searchParams}
      attributeType="cuisines"
    />
  );
};

export default CuisinePage;
