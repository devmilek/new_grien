import { HomeView } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-static"; // Force dynamic rendering for this page
export const revalidate = 600; // 10 minutes

export default function Home() {
  return (
    <div className="container">
      <HomeView />
    </div>
  );
}
