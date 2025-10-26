import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { RFQWithDetails } from "@shared/schema";
import { format } from "date-fns";

interface RFQTableProps {
  rfqs: RFQWithDetails[];
}

export function RFQTable({ rfqs }: RFQTableProps) {
  const getFrameworkBadge = (framework: string) => {
    const badges = {
      pfas: <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">PFAS</Badge>,
      buyamerica: <Badge variant="outline" className="bg-chart-2/5 text-chart-2 border-chart-2/20">Buy America</Badge>,
      eudr: <Badge variant="outline" className="bg-chart-3/5 text-chart-3 border-chart-3/20">EUDR</Badge>,
    };
    return badges[framework as keyof typeof badges] || <Badge variant="outline">{framework}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: "bg-muted text-muted-foreground",
      sent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      responded: "bg-green-500/10 text-green-600 border-green-500/20",
      negotiating: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      completed: "bg-green-600/10 text-green-700 border-green-600/20",
    };
    const colorClass = statusColors[status as keyof typeof statusColors] || "bg-muted text-muted-foreground";
    
    return (
      <Badge variant="outline" className={colorClass}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border" data-testid="table-rfqs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Framework</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Solicitation #</TableHead>
            <TableHead>NAICS</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rfqs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No RFQs found
              </TableCell>
            </TableRow>
          ) : (
            rfqs.map((rfq) => {
              const requirements = rfq.requirements as any;
              
              return (
                <TableRow key={rfq.id} data-testid={`row-rfq-${rfq.id}`}>
                  <TableCell>{getFrameworkBadge(rfq.framework)}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="font-medium truncate" title={rfq.subject}>
                      {rfq.subject}
                    </div>
                    {requirements?.department && (
                      <div className="text-xs text-muted-foreground truncate">
                        {requirements.department}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{rfq.buyer?.name || 'N/A'}</div>
                    {rfq.buyer?.contactEmail && (
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]" title={rfq.buyer.contactEmail}>
                        {rfq.buyer.contactEmail}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(rfq.status)}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {requirements?.solicitationNumber || 'N/A'}
                    </code>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {requirements?.naicsCode || 'N/A'}
                    </code>
                  </TableCell>
                  <TableCell>
                    {requirements?.responseDeadline ? (
                      <div className="text-sm">
                        {format(new Date(requirements.responseDeadline), 'MM/dd/yyyy')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(rfq.createdAt), 'MM/dd/yyyy')}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
