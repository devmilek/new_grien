import CategoryPage from "@/modules/attributes/ui/views/category-view";
import { SearchParams } from "nuqs";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

const CategorySlugPage = async ({ params, searchParams }: PageProps) => {
  return <CategoryPage params={params} searchParams={searchParams} />;
};

export default CategorySlugPage;
