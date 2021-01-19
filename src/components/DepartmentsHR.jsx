import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Button from '@material-ui/core/Button';
import TxtField from "./TxtField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CollapsedRow from "./CollapsedRow";
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';

const user = localStorage.getItem("JWT");

const columns = [
    { id: "name", label: "Name", minWidth: 100, align: "center" },
    { id: "HOD", label: "HOD", minWidth: 100, align: "center" },
    { id: "delete", label: "Delete", minWidth: 100, align: "center" },
    { id: "update", label: "Update", minWidth: 100, align: "center" },
    { id: "courses", label: "Courses", minWidth: 100, align: "center" }
];

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: 'column',
        alignContent: "center"
    },
    container: {
        maxHeight: "100%"
    },
    button: {
        width: '25ch',
        marginBottom: "2%"
    }
});

export default function DepartmentsHR() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);

    const [addFacultyName, setAddFacultyName] = React.useState("");
    const [toBeAddedDepartment, setToBeAddedDepartment] = React.useState("");
    const [addResponse, setAddResponse] = React.useState("");

    const [update, setUpdate] = React.useState(false);
    const [openUpdateForm,setOpenUpdateForm] = React.useState(false);
    const [toBeupdatedDepartmentName, settoBeupdatedDepartmentName] = React.useState("");
    const [updateDepName, setUpdateDepName] = React.useState("");
    const [updateFacultyName, setUpdateFacultyName] = React.useState("");
    const [updateHODID, setUpdateHODID] = React.useState("");
    const [updateResponce, setUpdateRespose] = React.useState("");

    const [openDeleteForm, setOpenDeleteForm] = React.useState(false);
    const [toBeDeletedDepartment, setToBeDeletedDepartment] = React.useState("");
    const [FacultyDelete, setFacultyDelete] = React.useState("");
    const [deleteResponse, setDeleteResponse] = React.useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const viewDepartments = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3001/HR/viewDepartments",{ headers: { "token": user } });
            setRows(response.data);
        } catch (error) {
            // TODO : Handle error here
            console.log(error);
        }
    }, [])

    React.useEffect(() => {
        setInterval(() => {
            viewDepartments();
        }, 1000);
    }, [viewDepartments]);

    function assignDepartmentName(name) {
        setToBeAddedDepartment(name);
        setUpdate(false);
    }

    function assignFacultyName(name) {
        setAddFacultyName(name);
        setUpdate(false);
    }

    const addDepartment = async () => {
        try {
            setAddResponse("")
            setDeleteResponse("")
            setUpdateRespose("")
            const response = await axios.post("http://localhost:3001/HR/addDepartment", {
                faculty: addFacultyName,
                name: toBeAddedDepartment
            },{ headers: { "token": user } })
            setAddResponse(response.data)
        } catch (error) {
            // TODO : handle error page here
            console.log(error);
        }
    }

    function deleteFacultyName(name_) {
        setFacultyDelete(name_)
    }

    function intializeDelete(name_) {
        setToBeDeletedDepartment(name_);
        setUpdate(false);
        setOpenDeleteForm(true);
    }

    function closeDeleteForm(){
        setOpenDeleteForm(false);
        setDeleteResponse("");
    }

    const deleteDepartment = async () => {
        try {
            setAddResponse("")
            setDeleteResponse("")
            setUpdateRespose("")
            const response = await axios.post("http://localhost:3001/HR/deleteDepartment", {
                department: toBeDeletedDepartment,
                faculty: FacultyDelete
            },{ headers: { "token": user } });
            console.log(response.data)
            setDeleteResponse(response.data);
            viewDepartments();
        } catch (error) {
            // TODO : handle error page here
            console.log(error);
        }
    }

    function updateFName(name_) {
        setUpdateFacultyName(name_);
    }

    function updateDepartmentName(name_) {
        setUpdateDepName(name_);
    }

    function updateHOD(id_) {
        setUpdateHODID(id_);
    }

    function intializeUpdates(name_) {
        settoBeupdatedDepartmentName(name_);
        setOpenUpdateForm(true);
    }

    function closeUpdateForm(){
        setOpenUpdateForm(false);
        setUpdateRespose("");
    }

    const updateDepartment = async (name_) => {
        try {
            setAddResponse("")
            setDeleteResponse("")
            setUpdateRespose("")
            const updates_ = {};
            if (updateHODID !== "") {
                updates_.HOD = updateHODID
            }
            if (updateDepName !== "") {
                updates_.name = updateDepName
            }
            const response = await axios.post("http://localhost:3001/HR/updateDepartment", {
                name: toBeupdatedDepartmentName,
                facultyName: updateFacultyName,
                updates: updates_
            },{ headers: { "token": user } })
            setUpdateRespose(response.data)
        } catch (error) {
            // TODO : handle error page here
            console.log(error);
        }
    }


    return (
        <Paper className={classes.root} elevation={3}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => {
                                return <StyledTableCell align={column.align}>
                                    {column.label}
                                </StyledTableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, rowIndex) => {
                                return (
                                    <CollapsedRow
                                        hover role="checkbox"
                                        tabIndex={-1}
                                        key={rowIndex}
                                        id={row.name}
                                        mainData={
                                            ((columns.filter((column) => {
                                                return column.id !== "courses"
                                            }))
                                                .map((head) => {
                                                    return row[head.id]
                                                }))}
                                        numberOfTables={[0]}
                                        collapseTitle="Courses"
                                        collapseHeads={[["courses"]]}
                                        collapseRows={[row.courses]}
                                        onDelete={intializeDelete}
                                        onUpdate={intializeUpdates}
                                    />
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage} />

            <Dialog open={openDeleteForm} onClose={closeDeleteForm} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Delete Department {toBeDeletedDepartment}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To Delete a department, please choose the faculty from which the department will be deleted.
                    </DialogContentText>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                        <TxtField
                            key="fACULTYNameDelete"
                            name="Faculty name"
                            setText={deleteFacultyName}
                        />
                    </div>

                </DialogContent>
                {deleteResponse === `Department Deleted Successfully!` && <Alert className="alerts" severity="success">Department Deleted Successfully!</Alert>}
                {deleteResponse === `Department does not exist under this faculty` && <Alert className="alerts" severity="warning">Department does not exist under this faculty</Alert>}
                <DialogActions>
                <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={closeDeleteForm}
                    >Close</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={() => {
                            deleteDepartment();
                        }}
                    >Delete</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog open={openUpdateForm} onClose={closeUpdateForm} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update department {toBeupdatedDepartmentName}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill desired update fields.
                    </DialogContentText>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                    <TxtField
                        key="UpdateFacultyName"
                        name="Faculty"
                        helperText="Faculty Name"
                        setText={updateFName}
                    />
                    <TxtField
                        key="UpdateDepartmentName"
                        name="Department Name"
                        helperText="New department name"
                        setText={updateDepartmentName}
                    />
                    <TxtField
                        key="UpdateHOD"
                        name="HOD"
                        helperText="Head Of Department ID"
                        setText={updateHOD}
                    />
                    </div>

                </DialogContent>
                {updateResponce === `Department updated successfully!` && <Alert className="alerts" severity="success">{updateResponce}</Alert>}
                {(updateResponce === `Department not found` || updateResponce === `Department does not exist under the given faculty`) && <Alert className="alerts" severity="warning">{updateResponce}</Alert>}<DialogActions>
                <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={closeUpdateForm}
                    >Close</Button>
                    <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => {
                        updateDepartment();
                    }}
                >Update</Button>
                </DialogActions>
            </Dialog>

            <div style={{ display: "flex", flexDirection: "column", margin: "5%", alignItems: "center" }}>
                <h1 className="text-HeaderHR">Add Department</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                    <TxtField
                        key="newDepartment"
                        name="Department"
                        helperText="Type department name"
                        setText={assignDepartmentName}
                    />
                    <TxtField
                        key="FacultyAddname"
                        name="Faculty"
                        helperText="Faculty under which the department will be added"
                        setText={assignFacultyName}
                    />
                </div>
                <Button variant="contained" color="primary" className={classes.button}
                    onClick={() => {
                        addDepartment();
                    }}>
                    Add</Button>
                {addResponse === `Department added successfully!` && <Alert className="alerts" severity="success">Department added successfully!</Alert>}
                {addResponse === `There is no Faculty with the given name` && <Alert className="alerts" severity="warning">There is no Faculty with the given name</Alert>}
            </div>
        </Paper>
    );
}