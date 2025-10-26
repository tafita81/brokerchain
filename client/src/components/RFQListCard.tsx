import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, Mail, FileText, CheckCircle2 } from "lucide-react";
import type { RFQWithDetails } from "@shared/schema";
import { format } from "date-fns";

interface RFQListCardProps {
  rfq: RFQWithDetails;
}

export function RFQListCard({ rfq }: RFQListCardProps) {
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: "bg-muted text-muted-foreground",
      sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      responded: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      negotiating: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return statusMap[status] || statusMap.draft;
  };

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-rfq-${rfq.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {rfq.subject}
          </CardTitle>
          <Badge className={getStatusColor(rfq.status)}>
            {rfq.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* RFQ Content */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {rfq.content}
        </p>

        {/* Buyer Information */}
        {rfq.buyer && (
          <div className="p-4 rounded-md bg-muted/50 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="w-4 h-4 text-primary" />
              <span>Buyer Information</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-3 h-3 text-muted-foreground" />
                <span className="font-medium">{rfq.buyer.name}</span>
              </div>
              {rfq.buyer.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                  <a 
                    href={`mailto:${rfq.buyer.contactEmail}`}
                    className="text-primary hover:underline"
                    data-testid={`link-buyer-email-${rfq.id}`}
                  >
                    {rfq.buyer.contactEmail}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-2 mt-2">
                <div className="text-muted-foreground text-xs">
                  Industry: {rfq.buyer.industry} | Country: {rfq.buyer.country}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requirements */}
        {rfq.requirements && Object.keys(rfq.requirements).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="w-4 h-4 text-primary" />
              <span>Requirements</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(rfq.requirements as Record<string, unknown>).slice(0, 5).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {typeof value === 'object' ? JSON.stringify(value).slice(0, 20) : String(value).slice(0, 30)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Footer with date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="w-3 h-3" />
          <span>Created: {format(new Date(rfq.createdAt), "MMM dd, yyyy")}</span>
          {rfq.sentAt && (
            <>
              <span className="mx-1">•</span>
              <CheckCircle2 className="w-3 h-3" />
              <span>Sent: {format(new Date(rfq.sentAt), "MMM dd, yyyy")}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
