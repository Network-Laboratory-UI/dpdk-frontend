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
  const [deleteBlokcedItemDialog, setDeleteBlokcedItemDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedBlokcedItem, setSelectedBlokcedItem] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [deleteBlockedItemDialog, setDeleteBlockedItemDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/ps/blocked-list/${id}`
      );
      const data = response.data;
      setBlockedItems(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setBlockedItems([]);
    }
  };

  const openNew = () => {
    setBlockedItem(emptyBlockedItem);
    setSubmitted(false);
    setBlockedItemDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setBlockedItemDialog(false);
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
          `${process.env.REACT_APP_BASE_URL}/ps/blocked-list/${id}`,
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
      } finally {
        setBlockedItemDialog(false);
        setBlockedItem(emptyBlockedItem);
      }
    }
  };

  const onInputChange = (e, name) => {
    const val = e.target.value || "";
    setBlockedItem((prevState) => ({ ...prevState, [name]: val }));
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
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
          onClick={confirmDeleteSelected}
          disabled={!selectedBlokcedItem || !selectedBlokcedItem.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        // onClick={exportCSV}
      />
    );
  };

  const confirmDeleteSelected = () => {
    setDeleteBlokcedItemDialog(true);
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Blocked List</h4>
      <span className="p-input-icon-end">
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
        <i className="pi pi-search" />
      </span>
    </div>
  );

  const blockedItemDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveBlockedItem}
      />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() =>
            toast.current.show({
              severity: "info",
              summary: "Info Message",
              detail: "Deleted",
            })
          }
        />
      </React.Fragment>
    );
  };

  const confirmDeleteBlockedItem = (blockedItem) => {
    setBlockedItem(blockedItem);
    setDeleteBlockedItemDialog(true);
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
          selection={selectedBlokcedItem}
          onSelectionChange={(e) => setSelectedBlokcedItem(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} blocked items"
          globalFilter={globalFilter}
          header={header}
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="ps_id" header="PS ID" sortable></Column>
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
        className="p-fluid"
        footer={blockedItemDialogFooter}
        onHide={hideDialog}
      >
        <div className="p-field">
          <label htmlFor="ps_id">PS ID</label>
          <InputText
            id="ps_id"
            value={blockedItem.ps_id}
            onChange={(e) => onInputChange(e, "ps_id")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={blockedItem.name}
            onChange={(e) => onInputChange(e, "name")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="domain">Domain</label>
          <InputText
            id="domain"
            value={blockedItem.domain}
            onChange={(e) => onInputChange(e, "domain")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="ip_add">IP Address</label>
          <InputText
            id="ip_add"
            value={blockedItem.ip_add}
            onChange={(e) => onInputChange(e, "ip_add")}
          />
        </div>
      </Dialog>

      <Dialog
        visible={deleteBlockedItemDialog}
        style={{ width: "30rem" }}
        header="Confirm"
        modal
        footer={blockedItemDialogFooter}
        onHide={hideDeleteBlockedItemDialog}
      >
        <div>
          <p>
            Are you sure you want to delete the blocked item{" "}
            <strong>{blockedItem.name}</strong>?
          </p>
        </div>
      </Dialog>
    </div>
  );
};

export default BlockedListTable;
