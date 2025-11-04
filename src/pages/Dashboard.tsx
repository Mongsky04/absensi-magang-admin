import { useEffect, useState } from "react";
import axios from "axios";

interface Attendance {
  _id: string;
  name: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  photoUrl?: string;
}

const AdminDashboard = () => {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/api/admin/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Memuat data...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Rekap Kehadiran Peserta</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">No</th>
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-left">Tanggal</th>
              <th className="p-2">Check In</th>
              <th className="p-2">Check Out</th>
              <th className="p-2">Status</th>
              <th className="p-2">Foto</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.date}</td>
                <td className="p-2">{item.checkIn || "-"}</td>
                <td className="p-2">{item.checkOut || "-"}</td>
                <td className="p-2">{item.status}</td>
                <td className="p-2">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
