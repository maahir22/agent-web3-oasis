// TaskTable.tsx
interface Task {
  contract_id: string;
  task_uuid: string;
  task_price: string;
  task_description: string;
  state: string;
  proof_cid: string;
  verifier_notes: string;
  last_updated: string;
}

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
}

const TaskTable = ({ tasks, isLoading }: TaskTableProps) => {
  if (isLoading) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '16px' }}>Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '16px' }}>No tasks available</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          tableLayout: 'auto',
          backgroundColor: '#1a1a2e',
          color: '#fff',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                padding: '8px',
                maxWidth: '200px',
                border: '1px solid #4b4b6b',
                textAlign: 'left',
              }}
            >
              Contract ID
            </th>
            <th
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                padding: '8px',
                maxWidth: '200px',
                border: '1px solid #4b4b6b',
                textAlign: 'left',
              }}
            >
              Task UUID
            </th>
            <th
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                padding: '8px',
                maxWidth: '200px',
                border: '1px solid #4b4b6b',
                textAlign: 'left',
              }}
            >
              Description
            </th>
            <th
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                padding: '8px',
                maxWidth: '200px',
                border: '1px solid #4b4b6b',
                textAlign: 'left',
              }}
            >
              Price
            </th>
            <th
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                padding: '8px',
                maxWidth: '200px',
                border: '1px solid #4b4b6b',
                textAlign: 'left',
              }}
            >
              Status
            </th>
            <th
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                padding: '8px',
                maxWidth: '200px',
                border: '1px solid #4b4b6b',
                textAlign: 'left',
              }}
            >
              Proof CID
            </th>
            <th
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                padding: '8px',
                maxWidth: '200px',
                border: '1px solid #4b4b6b',
                textAlign: 'left',
              }}
            >
              Verifier Notes
            </th>
            <th
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                padding: '8px',
                maxWidth: '200px',
                border: '1px solid #4b4b6b',
                textAlign: 'left',
              }}
            >
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.task_uuid}>
              <td
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  padding: '8px',
                  maxWidth: '200px',
                  border: '1px solid #4b4b6b',
                }}
                data-label="Contract ID"
              >
                <a
                  href={`https://sepolia.etherscan.io/address/${task.contract_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#fff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {task.contract_id}
                </a>
              </td>
              <td
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  padding: '8px',
                  maxWidth: '200px',
                  border: '1px solid #4b4b6b',
                }}
                data-label="Task UUID"
              >
                {task.task_uuid}
              </td>
              <td
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  padding: '8px',
                  maxWidth: '200px',
                  border: '1px solid #4b4b6b',
                }}
                data-label="Description"
              >
                {task.task_description}
              </td>
              <td
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  padding: '8px',
                  maxWidth: '200px',
                  border: '1px solid #4b4b6b',
                }}
                data-label="Price"
              >
                {task.task_price}
              </td>
              <td
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  padding: '8px',
                  maxWidth: '200px',
                  border: '1px solid #4b4b6b',
                }}
                data-label="Status"
              >
                {task.state}
              </td>
              <td
                style={{
                  padding: '8px',
                  maxWidth: '200px',
                  border: '1px solid #4b4b6b',
                }}
                data-label="Proof CID"
              >
                {task.proof_cid ? (
                  <a
                    href={`https://${task.proof_cid}.ipfs.w3s.link`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#fff',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    Click here
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  padding: '8px',
                  maxWidth: '200px',
                  border: '1px solid #4b4b6b',
                }}
                data-label="Verifier Notes"
              >
                {task.verifier_notes}
              </td>
              <td
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  padding: '8px',
                  maxWidth: '200px',
                  border: '1px solid #4b4b6b',
                }}
                data-label="Last Updated"
              >
                {task.last_updated}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;