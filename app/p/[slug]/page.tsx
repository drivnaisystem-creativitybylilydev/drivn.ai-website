import { notFound } from "next/navigation";
import { getProposal, proposals } from "@/lib/proposals/proposals";
import ProposalView from "./ProposalView";

export async function generateStaticParams() {
  return proposals.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposal = getProposal(slug);
  if (!proposal) return {};
  return {
    title: `Angebot für ${proposal.client} — Drivn.AI`,
    robots: { index: false, follow: false },
  };
}

export default async function ProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposal = getProposal(slug);
  if (!proposal) notFound();
  return <ProposalView proposal={proposal} />;
}
