import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import axios from "axios";

const BlockedListTable = ({ id }) => {
  const emptyBlockedItem = {
    id: null,
    ps_id: null,
    name: "",
    domain: "",
    ip_add: "",
    hit_count: 0,
  };

  const [blockedItems, setBlockedItems] = useState(null);
  const [blockedItemDialog, setBlockedItemDialog] = useState(false);
  const [blockedItem, setBlockedItem] = useState(emptyBlockedItem);
  const [submitted, setSubmitted] = useState(false);
  const [selectedBlockedItem, setSelectedBlockedItem] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [deleteBlockedItemDialog, setDeleteBlockedItemDialog] = useState(false);
  const [updateBlockedItemDialog, setUpdateBlockedItemDialog] = useState(false);
  const [deleteBatchItemDialog, setDeleteBatchItemDialog] = useState(false);
  const [updateBlockedItem, setUpdateBlockedItem] = useState(emptyBlockedItem);
  const [deleteBlockedItem, setDeleteBlockedItem] = useState(emptyBlockedItem);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/ps/blocked-list`
      );

      if (
        response.data.message &&
        response.data.message === "No PS blocked list found"
      ) {
        setBlockedItems([]); // Set an empty array if no data is found
      } else {
        const data = response.data;
        setBlockedItems(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setBlockedItems([]);
    }
  };

  useEffect(() => {
    console.log("selectedBlockedItem:", selectedBlockedItem);
  }, [selectedBlockedItem]);

  const openNew = () => {
    setBlockedItem(emptyBlockedItem);
    setSubmitted(false);
    setBlockedItemDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setBlockedItemDialog(false);
    setUpdateBlockedItemDialog(false);
    setDeleteBlockedItemDialog(false);
    setDeleteBatchItemDialog(false);
  };

  const saveBlockedItem = async () => {
    setSubmitted(true);

    if (
      blockedItem.name.trim() &&
      blockedItem.domain.trim() &&
      blockedItem.ip_add.trim()
    ) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/ps/blocked-list`,
          blockedItem
        );
        if (response.status === 200) {
          fetchData();
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Blocked Item Created",
            life: 3000,
          });
          // Reset state and close dialog
          setBlockedItemDialog(false);
          setBlockedItem(emptyBlockedItem);
          setSubmitted(false);
        } else {
          throw new Error("Failed to save blocked item");
        }
      } catch (error) {
        console.error("Error saving blocked item:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to save blocked item",
          life: 3000,
        });
        // Reset submitted state
        setSubmitted(false);
      }
    } else {
      // Show toast message for validation error
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill all fields",
        life: 3000,
      });
      // Reset submitted state
      setSubmitted(false);
    }
  };

  const openUpdateDialog = (item) => {
    setUpdateBlockedItem(item);
    setUpdateBlockedItemDialog(true);
  };

  const openDeleteDialog = (rowData) => {
    setDeleteBlockedItem(rowData);
    setDeleteBlockedItemDialog(true);
  };

  const openBatchDeleteDialog = () => {
    setDeleteBatchItemDialog(true);
  };

  const handleUpdateBlockedItem = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/ps/blocked-list/${updateBlockedItem.id}`,
        updateBlockedItem
      );
      if (response.status === 200) {
        fetchData();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Blocked Item Updated",
          life: 3000,
        });
        setUpdateBlockedItemDialog(false);
        setUpdateBlockedItem(emptyBlockedItem);
      } else {
        throw new Error("Failed to update blocked item");
      }
    } catch (error) {
      console.error("Error updating blocked item:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update blocked item",
        life: 3000,
      });
    }
  };

  const deleteBlockedItemConfirm = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/ps/blocked-list/${deleteBlockedItem.id}`
      );
      if (response.status !== 200) {
        throw new Error(
          `Failed to delete blocked item with ID ${deleteBlockedItem.id}`
        );
      }

      fetchData();
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Blocked Item Deleted",
        life: 3000,
      });
      setDeleteBlockedItemDialog(false);
      setDeleteBlockedItem(emptyBlockedItem);
    } catch (error) {
      console.error("Error deleting blocked item:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete blocked item",
        life: 3000,
      });
    }
  };

  const confirmDeleteBatchBlockedItem = async () => {
    try {
      // Use Promise.all to send all delete requests concurrently
      await Promise.all(
        selectedBlockedItem.map(async (blockedItem) => {
          const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/ps/blocked-list/${blockedItem.id}`
          );
          if (response.status !== 200) {
            throw new Error(
              `Failed to delete blocked item with ID ${blockedItem.id}`
            );
          }
        })
      );

      fetchData();
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Blocked Item(s) Deleted",
        life: 3000,
      });
      setDeleteBatchItemDialog(false);
    } catch (error) {
      console.error("Error deleting blocked item(s):", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete blocked item(s)",
        life: 3000,
      });
    } finally {
      setDeleteBatchItemDialog(false);
      setSelectedBlockedItem(null);
    }
  };

  const onInputChangeUpdate = (e, name) => {
    const val = e.target.value || "";
    setUpdateBlockedItem((prevState) => ({ ...prevState, [name]: val }));
  };

  const onInputChange = (e, name) => {
    const val = e.target.value || "";
    setBlockedItem((prevState) => ({ ...prevState, [name]: val }));
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2 font-['Helvetica']">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={openBatchDeleteDialog}
          disabled={!selectedBlockedItem || !selectedBlockedItem.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help font-['Helvetica']"
        // onClick={exportCSV}
      />
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between ">
      <h4 className="m-0">Blocked List</h4>
      <span className="p-input-icon-end">
        <i className="pi pi-search" />
        <InputText
          className="p-2 mr-1 ml-2 rounded-xl font-['Helvetica'] font-normal"
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const blockedItemDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800 rounded-lg px-4 py-2 mr-2  font-['Helvetica']"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text bg-red-primary hover:bg-red-500 rounded-lg px-4 py-2 text-white font-['Helvetica']"
        onClick={saveBlockedItem}
      />
    </React.Fragment>
  );

  const deleteBlockedItemFooterDialog = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800 rounded-lg px-4 py-2 mr-2  font-['Helvetica']"
        onClick={hideDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text bg-red-primary hover:bg-red-500 rounded-lg px-4 py-2 text-white font-['Helvetica']"
        onClick={deleteBlockedItemConfirm}
      />
    </React.Fragment>
  );

  const deleteBatchBlockedItemFooterDialog = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800 rounded-lg px-4 py-2 mr-2  font-['Helvetica']"
        onClick={hideDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text bg-red-primary hover:bg-red-500 rounded-lg px-4 py-2 text-white font-['Helvetica']"
        onClick={confirmDeleteBatchBlockedItem}
      />
    </React.Fragment>
  );

  const blockedItemDialogFooterUpdate = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800 rounded-lg px-4 py-2 mr-2  font-['Helvetica']"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text bg-red-primary hover:bg-red-500 rounded-lg px-4 py-2 text-white font-['Helvetica']"
        onClick={handleUpdateBlockedItem}
      />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          style={{ color: "blue" }}
          onClick={() => openUpdateDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          style={{ color: "red" }}
          onClick={() => openDeleteDialog(rowData)}
        />
      </React.Fragment>
    );
  };

  const hideDeleteBlockedItemDialog = () => {
    setDeleteBlockedItemDialog(false);
  };

  return (
    <div className="body ">
      <Toast ref={toast} />
      <div className="card">
        <div className="flex justify-end mb-2">
          <Toolbar
            className="mb-4"
            start={leftToolbarTemplate}
            end={rightToolbarTemplate}
          ></Toolbar>
        </div>
        <DataTable
          ref={dt}
          value={blockedItems}
          selection={selectedBlockedItem}
          onSelectionChange={(e) => setSelectedBlockedItem(e.value)}
          dataKey="id"
          paginator
          rows={20}
          rowsPerPageOptions={[10, 15, 20]}
          paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
          currentPageReportTemplate="{first}-{last} of {totalRecords}"
          scrollable
          scrollHeight="calc(100vh - 300px)"
          globalFilter={globalFilter}
          header={header}
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="domain" header="Domain" sortable></Column>
          <Column field="ip_add" header="IP Address" sortable></Column>
          <Column field="hit_count" header="Hit Count" sortable></Column>
          <Column
            body={actionBodyTemplate}
            style={{ textAlign: "center", overflow: "visible" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={blockedItemDialog}
        style={{ width: "30rem" }}
        header="Add/Edit Blocked Item"
        modal
        className="p-fluid font-['Helvetica']"
        footer={blockedItemDialogFooter}
        onHide={hideDialog}
      >
        <div className="p-field">
          <label htmlFor="name" className="font-['Helvetica']">
            Name
          </label>
          <InputText
            id="name"
            value={blockedItem.name}
            onChange={(e) => onInputChange(e, "name")}
            className="p-inputtext-custom w-full p-2 border border-gray-300 rounded-xl mt-1"
            // Add Tailwind classes for styling
          />
        </div>
        <div className="p-field">
          <label htmlFor="domain" className="font-['Helvetica']">
            Domain
          </label>
          <InputText
            id="domain"
            value={blockedItem.domain}
            onChange={(e) => onInputChange(e, "domain")}
            className="p-inputtext-custom w-full p-2 border border-gray-300 rounded-xl mt-1"
            // Add Tailwind classes for styling
          />
        </div>
        <div className="p-field">
          <label htmlFor="ip_add" className="font-['Helvetica']">
            IP Address
          </label>
          <InputText
            id="ip_add"
            value={blockedItem.ip_add}
            onChange={(e) => onInputChange(e, "ip_add")}
            className="p-inputtext-custom w-full p-2 border border-gray-300 rounded-xl"
            // Add Tailwind classes for styling
          />
        </div>
      </Dialog>

      <Dialog
        visible={deleteBlockedItemDialog}
        style={{ width: "30rem" }}
        header="Confirm"
        modal
        footer={deleteBlockedItemFooterDialog}
        onHide={hideDeleteBlockedItemDialog}
        className="font-['Helvetica']"
      >
        <div>
          <p>
            Are you sure you want to delete the blocked item{" "}
            <strong>{blockedItem.name}</strong>?
          </p>
        </div>
      </Dialog>

      <Dialog
        visible={deleteBatchItemDialog}
        style={{ width: "30rem" }}
        header="Confirm"
        modal
        footer={deleteBatchBlockedItemFooterDialog}
        onHide={hideDialog}
        className="font-['Helvetica']"
      >
        <div>
          <p>
            Are you sure you want to delete the blocked item{" "}
            <strong>{blockedItem.name}</strong>?
          </p>
        </div>
      </Dialog>

      <Dialog
        visible={updateBlockedItemDialog}
        style={{ width: "30rem" }}
        header="Update Blocked Item"
        modal
        className="p-fluid font-['Helvetica']"
        footer={blockedItemDialogFooterUpdate}
        onHide={hideDialog}
      >
        <div className="p-field">
          <label htmlFor="name" className="font-['Helvetica']">
            Name
          </label>
          <InputText
            id="name"
            value={updateBlockedItem.name}
            onChange={(e) => onInputChangeUpdate(e, "name")}
            className="p-inputtext-custom w-full p-2 border border-gray-300 rounded-xl mt-1"
          />
        </div>
        <div className="p-field">
          <label htmlFor="domain" className="font-['Helvetica']">
            Domain
          </label>
          <InputText
            id="domain"
            value={updateBlockedItem.domain}
            onChange={(e) => onInputChangeUpdate(e, "domain")}
            className="p-inputtext-custom w-full p-2 border border-gray-300 rounded-xl mt-1"
          />
        </div>
        <div className="p-field">
          <label htmlFor="ip_add" className="font-['Helvetica']">
            IP Address
          </label>
          <InputText
            id="ip_add"
            value={updateBlockedItem.ip_add}
            onChange={(e) => onInputChangeUpdate(e, "ip_add")}
            className="p-inputtext-custom w-full p-2 border border-gray-300 rounded-xl"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default BlockedListTable;
