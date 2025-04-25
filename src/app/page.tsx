"use client";
import { useEffect, useState } from "react";
import columns from "./pageColumns";
import Datagrid from "./datagrid";
import PageHeader from "./pageHeader";
import AlertBanner from "./alertBanner";
import {
  GridRowId
} from '@mui/x-data-grid';

interface AdvocateCreate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt: Date;
};

interface AlertObject {
  msg: String;
  type: "error" | "success" | ""
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<String>("");
  const [alert, setAlert] = useState<AlertObject>({ type: "", msg: "" });
  const heightPerRow = 50;

  useEffect(() => {
    // Fetching data from API
    fetch("/api/advocates")
      .then((response) => {
        if (!response.ok) {
          setAlert({ type: "error", msg: `Error fetching advocates: ${response.statusText}` });
        }
        return response.json();
      })
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data.sort((a: Advocate, b: Advocate) => b.id - a.id));
      })
      .catch((error) => {
        console.error("Failed to fetch advocates:", error);
      });

    setLoading(false);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const processRowCreate = async (): Promise<void> => {
    try {
      // Define default values for a new Advocate row
      const newRow: AdvocateCreate = {
        firstName: "",
        lastName: "",
        city: "",
        degree: "",
        specialties: [],
        yearsOfExperience: 0,
        phoneNumber: 0,
      };

      // Make an API call to the CREATE endpoint
      const response = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([newRow]), // Send the newRow as an array to match the API
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Optionally log the created row details
      const { advocates: createdRow }: { advocates: Advocate[] } = await response.json();

      // Update state to include the newly created row(s)
      setAdvocates((prevAdvocates) => [...prevAdvocates, ...createdRow].sort((a, b) => b.id - a.id));

      setAlert({ type: "success", msg: `Successfully created row!` });

    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating row:", error.message);
        setAlert({ type: "error", msg: `Failed to create row: ${error.message}` });
      } else {
        console.error("Unknown error creating row:", error);
        setAlert({ type: "error", msg: `An unknown error occurred while creating the row.` });
      }
    }
  };

  const processRowUpdate = async (
    newRow: Advocate,
    oldRow: Advocate,
    params: { rowId: GridRowId }
  ): Promise<Advocate> => {
    try {
      const response = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([newRow]), // Send newRow as an array to match the POST function
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Type response properly
      const { advocates: updatedAdvocates }: { advocates: Advocate[] } = await response.json();

      // Update the state with merged advocates list
      setAdvocates((prevAdvocates) => {
        const updatedMap = new Map(
          updatedAdvocates.map((advocate) => [advocate.id, advocate]) // Map updated rows by their id
        );

        return prevAdvocates.map((advocate) => updatedMap.get(advocate.id) || advocate).concat(
          updatedAdvocates.filter(
            (advocate) => !prevAdvocates.some((prev) => prev.id === advocate.id) // Append new rows not already present
          )
        );
      });

      setAlert({ type: "success", msg: `Successfully updated row!` });

      const updatedRow = { ...newRow, isNew: false }; // Mark as updated and not new
      return updatedRow;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating row:", error.message);
        setAlert({ type: "error", msg: `Failed to update row.` });
      } else {
        console.error("Unknown error:", error);
        setAlert({ type: "error", msg: `An unknown error occurred.` });
      }
      return oldRow; // Revert to the old row in case of failure
    }
  };

  const processRowDelete = async (id: GridRowId): Promise<void> => {
    try {
      // Make an API call to the DELETE endpoint
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ id }]), // Send an array with the row ID to match the DELETE API logic
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Optionally log the deleted row details
      const { advocates: deletedRow }: { advocates: Advocate[] } = await response.json();

      // Update state to remove the deleted row
      setAdvocates((prevAdvocates) =>
        prevAdvocates.filter((advocate) => advocate.id !== id) // Remove the row with matching ID
      );

      setAlert({ type: "success", msg: `Successfully deleted row!` });

    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting row:", error.message);
        setAlert({ type: "error", msg: `Failed to delete row: ${error.message}` });
      } else {
        console.error("Unknown error deleting row:", error);
        setAlert({ type: "error", msg: `An unknown error occurred while deleting the row.` });
      }
    }
  };

  return (
    <main style={{ margin: "auto" }}>
      {/* Page Header */}
      <PageHeader handleRefresh={handleRefresh} />

      {/* Alert if failed to load data */}
      <AlertBanner alert={alert} />

      {/* Datagrid for Advocates */}
      <Datagrid
        rows={advocates}
        setRows={setAdvocates}
        columns={columns}
        loading={loading}
        heightPerRow={heightPerRow}
        add={true}
        edit={true}
        del={true}
        processRowCreate={processRowCreate}
        processRowUpdate={processRowUpdate}
        processRowDelete={processRowDelete}
        fieldToFocus={'firstName'}
      />
    </main>
  );
}