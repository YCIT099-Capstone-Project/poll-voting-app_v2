import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ViewResponsesPage.css";

const ViewResponsesPage = () => {
  const [responses, setResponses] = useState([]);
  const { pollId } = useParams();

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND}/getResponses/${pollId}`
        );
        if (!response.ok) {
          throw new Error("HTTP status " + response.status);
        }
        const data = await response.json();
        const sortedResponses = data.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        setResponses(sortedResponses);
      } catch (error) {
        console.error("Fetching responses failed: ", error);
      }
    };
    fetchResponses();
  }, [pollId]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust format as per your requirement
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(responses);
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, "responses.xlsx");
  };

  const exportToPDF = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Responses of poll " + pollId;
    const headers = [["Timestamp", "Question", "Response"]];

    const data = responses.map((response) => [
      formatDateTime(response.created_at),
      response.question_text,
      response.response,
    ]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    autoTable(doc, content);
    doc.save("responses.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Responses of poll {pollId}</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#008CBA", // Teal color
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
        <button
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#f44336", // Red color
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={exportToPDF}
        >
          Export to PDF
        </button>
      </div>
      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          border: "1px solid #ddd", // Light grey border
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #ddd",
              backgroundColor: "#f2f2f2",
            }}
          >
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Timestamp
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Question
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Response
            </th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response, index) => (
            <tr
              key={response.id}
              style={{ backgroundColor: index % 2 ? "#f2f2f2" : "white" }}
            >
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                {formatDateTime(response.created_at)}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                {response.question_text}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                {response.response}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewResponsesPage;
