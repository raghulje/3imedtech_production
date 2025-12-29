interface DataTableProps {
  title?: string;
  data: any[];
  columns: Array<{
    key: string;
    header: string;
    render?: (value: any, item?: any) => React.ReactNode;
  }>;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  editLabel?: string;
  deleteLabel?: string;
}

export const DataTable = ({ title, data, columns, onEdit, onDelete, editLabel, deleteLabel }: DataTableProps) => (
  <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl overflow-hidden border border-white/40">
    {title && (
      <div className="px-6 py-4 border-b border-white/30 bg-gradient-to-r from-blue-500/10 to-teal-500/10">
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{title}</h3>
      </div>
    )}
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/20">
        <thead className="backdrop-blur-sm bg-white/40">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="backdrop-blur-sm bg-white/30 divide-y divide-white/20">
          {data.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-white/50 transition-colors duration-200">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                  {col.render ? col.render(item[col.key], item) : (item[col.key] ?? '')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title={editLabel || "Edit"}
                      >
                        <i className={editLabel === "Restore" ? "ri-restart-line text-lg" : "ri-edit-line text-lg"}></i>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title={deleteLabel || "Delete"}
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

