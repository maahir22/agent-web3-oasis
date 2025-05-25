
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
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-300">Loading tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-700/50">
            <TableHead className="text-gray-300 font-semibold">Contract ID</TableHead>
            <TableHead className="text-gray-300 font-semibold">Task ID</TableHead>
            <TableHead className="text-gray-300 font-semibold">Verifier Notes</TableHead>
            <TableHead className="text-gray-300 font-semibold">Proof CID</TableHead>
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
              <TableRow key={index} className="border-gray-700 hover:bg-gray-700/30 transition-colors">
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
