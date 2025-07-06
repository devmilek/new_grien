import AttributePage from "@/modules/attributes/ui/AttributePage";
import { SearchParams } from "nuqs";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

const OccasionPage = async ({ params, searchParams }: PageProps) => {
  return (
    <AttributePage
      params={params}
      searchParams={searchParams}
      attributeType="occasions"
    />
  );
};

export default OccasionPage;