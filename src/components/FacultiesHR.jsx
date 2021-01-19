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
    { id: "delete", label: "Delete", minWidth: 100, align: "center" },
    { id: "update", label: "Update", minWidth: 100, align: "center" },
    { id: "departments", label: "Departments", minWidth: 150, align: "center" }
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

export default function FacultiesHR() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    
    const [addFacultyName, setAddFacultyName] = React.useState("");
    const [addResponse,setAddResponse] = React.useState("");
    
    const [openUpdateForm,setOpenUpdateForm] = React.useState(false);
    const [toBeUpdatedFaculty, setToBeUpdatedFaculty] = React.useState("");
    const [updateFacultyName, setUpdateFacultyName] = React.useState("");
    const [updateResponce, setUpdateRespose] = React.useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    const viewFaculties = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3001/HR/viewFaculties",{ headers: { "token": user } });
            setRows(response.data);
        } catch (error) {
            // TODO : Handle error here
            console.log(error);
        }
    }, [addFacultyName])

    React.useEffect(() => {
        setInterval(() => {
            viewFaculties();
        }, 2000);
    }, [viewFaculties]);

    function assignFacultyName(name) {
        setAddFacultyName(name);
    }

    const addFaculty = async () => {
        try {
            setAddResponse("")
            setUpdateRespose("")
            if (addFacultyName.length !== 0) {
                const response = await axios.post("http://localhost:3001/HR/addFaculty", {
                    faculty: addFacultyName
                },{ headers: { "token": user } })
                setAddResponse(response.data)
            }
        } catch (error) {
            // TODO : handle error page here
            console.log(error);
        }
    }

    const deleteFaculty = async (name_) => {
        try {
            await axios.post("http://localhost:3001/HR/deleteFaculty", {
                name: name_
            },{ headers: { "token": user } });
            viewFaculties();
        } catch (error) {
            // TODO : handle error page here
            console.log(error);
        }
    }

    function updateName(name_) {
        setUpdateFacultyName(name_);
    }

    function intializeUpdates(name_) {
        setToBeUpdatedFaculty(name_);
        setOpenUpdateForm(true);
    }

    function closeUpdateForm(){
        setOpenUpdateForm(false);
        setUpdateRespose("");
    }

    const updateFaculty = async (name_) => {
        try {
            const response = await axios.post("http://localhost:3001/HR/updateFaculty", {
                name: toBeUpdatedFaculty,
                updates: {
                    name: updateFacultyName
                }
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
                                                return column.id !== "departments"
                                            }))
                                                .map((head) => {
                                                    return row[head.id]
                                                }))}
                                        numberOfTables={[0]}
                                        collapseTitle="Departments"
                                        collapseHeads={[["departments"]]}
                                        collapseRows={[row.departments]}
                                        onDelete={deleteFaculty}
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
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />

<Dialog open={openUpdateForm} onClose={closeUpdateForm} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Faculty of {toBeUpdatedFaculty}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill desired update fields.
                    </DialogContentText>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                    <TxtField
                        key="UpdateFacultyName"
                        name="New Faculty name"
                        helperText="Type new Name"
                        setText={updateName}
                    />
                    </div>

                </DialogContent>
                {updateResponce === `updated successfuly!` && <Alert className="alerts" severity="success">Faculty {toBeUpdatedFaculty} updated Successfully</Alert>}
                {updateResponce === `New name is already in use` && <Alert className="alerts" severity="warning">Faculty name is already in Use</Alert>}
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
                        updateFaculty();
                    }}
                >Update</Button>
                </DialogActions>
            </Dialog>

            <div style={{ display: "flex", flexDirection: "column", margin: "5%", alignItems: "center" }}>
                <h1 className="text-HeaderHR">Add Faculty</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                    <TxtField
                        key="newFaculty"
                        name="Faculty name"
                        helperText="Type faculty name"
                        setText={assignFacultyName}
                    />
                </div>

                <Button variant="contained" color="primary" className={classes.button}
                    onClick={() => {
                        addFaculty();
                    }}>
                    Add
                </Button>
                {addResponse === `Faculty added successfully!` && <Alert className="alerts" severity="success">{addResponse}</Alert>}
                {addResponse === `Faculty already exists!` && <Alert className="alerts" severity="warning">{addResponse}</Alert>}
            </div>
        </Paper>
    );
}