import { UserCard } from "../components/UserCard";
import { cleanUser } from "../libs/CleanUser";
import axios from "axios";
import { useState, useEffect } from "react";

interface IUser {
  name: string;
  email: string;
  imgUrl: string;
  address: string;
}

export default function RandomUserPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // โหลดค่า genAmount จาก localStorage (ถ้ามี) ตอน component mount
  const [genAmount, setGenAmount] = useState<number>(() => {
    const saved = localStorage.getItem("genAmount");
    return saved ? Number(saved) : 1;
  });

  // เก็บ genAmount ลง localStorage ทุกครั้งที่ genAmount เปลี่ยน
  useEffect(() => {
    localStorage.setItem("genAmount", genAmount.toString());
  }, [genAmount]);

  const generateBtnOnClick = async () => {
    if (genAmount < 1) {
      alert("กรุณากรอกจำนวนที่ถูกต้อง");
      return;
    }
    setIsLoading(true);
    try {
      const resp = await axios.get(
        `https://randomuser.me/api/?results=${genAmount}`
      );
      const users = resp.data.results;
      const cleanUsers = users.map(cleanUser);
      setUsers(cleanUsers);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเรียก API");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          min={1}
          value={genAmount}
          onChange={(e) => setGenAmount(Number(e.target.value))}
        />
        <button
          className="btn btn-dark"
          onClick={generateBtnOnClick}
          disabled={isLoading}
        >
          Generate
        </button>
      </div>

      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}

      {!isLoading && users.length === 0 && (
        <p className="text-center fst-italic mt-4"></p>
      )}

      {!isLoading &&
        users.map((user, index) => (
          <UserCard
            key={index}
            name={user.name}
            imgUrl={user.imgUrl}
            address={user.address}
            email={user.email}
          />
        ))}
    </div>
  );
}
