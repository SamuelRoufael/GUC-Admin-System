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

const columns = [
    { id: "name", label: "Name", minWidth: 100, align: "center" },
    { id: "coordinator", label: "Coordinator", minWidth: 100, align: "center" },
    { id: "delete", label: "Delete", minWidth: 100, align: "center" },
    { id: "update", label: "Update", minWidth: 100, align: "center" },
    { id: "instructors", label: "Instructors", minWidth: 100, align: "center" },
    { id: "TAs", label: " TAs", minWidth: 100, align: "center" }
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
    }
});

const user = localStorage.getItem("JWT");

export default function DepartmentsHR() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);

    const [addDepartmentName, setAddDepartmentName] = React.useState("");
    const [toBeAddedCourse, setToBeAddedCourse] = React.useState("");
    const [addResponse, setAddResponse] = React.useState("");

    const [openUpdateForm, setOpenUpdateForm] = React.useState(false);
    const [toBeupdatedCourse, setToBeupdatedCourse] = React.useState("");
    const [updateCourseName, setUpdateCourseName] = React.useState("");
    const [updateDepName, setUpdateDepName] = React.useState("");
    const [updateResponce, setUpdateRespose] = React.useState("");

    const [openDeleteForm, setOpenDeleteForm] = React.useState(false);
    const [toBeDeletedCourse, setToBeDeletedCourse] = React.useState("");
    const [DepartmentDelete, setDepartmentDelete] = React.useState("");
    const [deleteResponse, setDeleteResponse] = React.useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const viewCourses = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3001/HR/viewCourses",{ headers: { "token": user } });
            setRows(response.data);
        } catch (error) {
            // TODO : Handle error here
            console.log(error);
        }
    }, [])

    React.useEffect(() => {
        setInterval(() => {
            viewCourses();
        }, 1000);
    }, [viewCourses]);

    function assignDepartmentName(name) {
        setAddDepartmentName(name);
    }

    function assignCourseName(name) {
        setToBeAddedCourse(name);
    }

    const addCourse = async () => {
        try {
            setAddResponse("")
            const response = await axios.post("http://localhost:3001/HR/addCourse", {
                department: addDepartmentName,
                name: toBeAddedCourse
            },{ headers: { "token": user } })
            setAddResponse(response.data)
        } catch (error) {
            // TODO : handle error page here
            console.log(error);
        }
    }

    function deleteDepartmentName(name_) {
        setDepartmentDelete(name_)
    }

    function intializeDelete(name_) {
        setToBeDeletedCourse(name_);
        setOpenDeleteForm(true);
    }

    function closeDeleteForm() {
        setOpenDeleteForm(false);
        setDeleteResponse("");
    }

    const deleteCourse = async () => {
        try {
            setAddResponse("")
            const response = await axios.post("http://localhost:3001/HR/deleteCourse", {
                course: toBeDeletedCourse,
                department: DepartmentDelete
            },{ headers: { "token": user } });
            setDeleteResponse(response.data);
            viewCourses();
        } catch (error) {
            // TODO : handle error page here
            console.log(error);
        }
    }

    function updateCName(name_) {
        setUpdateCourseName(name_);
    }

    function updateDepartmentName(name_) {
        setUpdateDepName(name_);
    }

    function intializeUpdates(name_) {
        setToBeupdatedCourse(name_);
        setOpenUpdateForm(true);
    }

    function closeUpdateForm() {
        setOpenUpdateForm(false);
        setUpdateRespose("");
    }

    const updateCourse = async (name_) => {
        try {
            setAddResponse("")
            const updates_ = {};
            if (updateCourseName !== "") {
                updates_.name = updateCourseName
            }
            const response = await axios.post("http://localhost:3001/HR/updateCourse", {
                courseName: toBeupdatedCourse,
                departmentName: updateDepName,
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
                                    {column.id !== "TAs" ? (column.id !== "instructors" ? column.id : "Academic Members") : null}
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
                                                return (column.id !== "TAs" && column.id !== "instructors")
                                            }))
                                                .map((head) => {
                                                    return row[head.id]
                                                }))}
                                        numberOfTables={[0, 1]}
                                        collapseTitle="Academic Members"
                                        collapseHeads={[["Instructors"], ["TAs"]]}
                                        collapseRows={[row.instructors, row.TAs]}
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
                <DialogTitle id="form-dialog-title">Delete Course {toBeDeletedCourse}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To Delete a Course, please choose the Department from which the course will be removed.
                    </DialogContentText>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                    <TxtField
                        key="Department Name Delete"
                        name="Department name"
                        setText={deleteDepartmentName}
                    />
                    </div>

                </DialogContent>
                {deleteResponse === `Courses deleted successfully` && <Alert className ="alerts" severity="success">{deleteResponse}</Alert>}
                {deleteResponse === `Course does not exist under the given Department` && <Alert className ="alerts" severity="warning">{deleteResponse}</Alert>}<DialogActions>
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
                            deleteCourse();
                        }}
                    >Delete</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog open={openUpdateForm} onClose={closeUpdateForm} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Course {toBeupdatedCourse}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill desired update fields.
                    </DialogContentText>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                    <TxtField
                        key="UpdateDepartment"
                        name="Department"
                        helperText="Department Name"
                        setText={updateDepartmentName}
                    />
                    <TxtField
                        key="UpdateCourseName"
                        name="Course Name"
                        helperText="New course name"
                        setText={updateCName}
                    />
                    </div>

                </DialogContent>
                {updateResponce === `Course updated successfully!` && <Alert className="alerts" severity="success">{updateResponce}</Alert>}
                {(updateResponce === `Course does not exist!` ||
                    updateResponce === `New Course name is already in use` ||
                    updateResponce === `Course does not exist under the given department` ||
                    updateResponce === `please fill update field(s)`) && <Alert className="alerts" severity="warning">{updateResponce}</Alert>}
                <DialogActions>
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
                        updateCourse();
                    }}
                >Update</Button>
                </DialogActions>
            </Dialog>

            <div style={{ display: "flex", flexDirection: "column", margin: "5%", alignItems: "center" }}>
                <h1 className="text-HeaderHR">Add Course Under a Department</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                    <TxtField
                        key="addDepartment"
                        name="Department"
                        helperText="Department under which the course will be added"
                        setText={assignDepartmentName}
                    />
                    <TxtField
                        key="addCourse"
                        name="Course"
                        helperText="Course name"
                        setText={assignCourseName}
                    />
                </div>
                <Button variant="contained" color="primary" className={classes.button}
                    onClick={() => {
                        addCourse();
                    }}>
                    Add</Button>
                {addResponse === `Course addedd successfully!` && <Alert className="alerts" severity="success">{addResponse}</Alert>}
                {addResponse === `Department Not Found!` && <Alert className="alerts" severity="warning">{addResponse}</Alert>}
            </div>
        </Paper>
    );
}