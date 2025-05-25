
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Task {
  contract_id: string;
  task_id: string;
  verifier_notes: string;
  proof_cid: string;
}

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
}

const TaskTable = ({ tasks, isLoading }: TaskTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-500/30 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-300">Loading tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-500/30 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-purple-500/30 hover:bg-purple-500/20">
            <TableHead className="text-purple-200 font-semibold">Contract ID</TableHead>
            <TableHead className="text-purple-200 font-semibold">Task ID</TableHead>
            <TableHead className="text-purple-200 font-semibold">Verifier Notes</TableHead>
            <TableHead className="text-purple-200 font-semibold">Proof CID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-400 py-8">
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task, index) => (
              <TableRow key={index} className="border-purple-500/30 hover:bg-purple-500/10 transition-colors">
                <TableCell className="text-gray-300 font-mono text-sm">
                  {task.contract_id}
                </TableCell>
                <TableCell className="text-gray-300 font-medium">
                  {task.task_id}
                </TableCell>
                <TableCell className="text-gray-300 max-w-md">
                  <div className="truncate" title={task.verifier_notes}>
                    {task.verifier_notes}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300 font-mono text-sm">
                  <div className="truncate" title={task.proof_cid}>
                    {task.proof_cid}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;
