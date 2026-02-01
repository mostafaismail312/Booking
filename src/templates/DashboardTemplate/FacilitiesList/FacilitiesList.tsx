import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import SectionTitle from "../../../shared/SectionTitle/SectionTitle";
import { Add } from "@mui/icons-material";
import Swal from "sweetalert2";
import { axiosInstance } from "./../../../services/axiosInstance";
import { ADMIN_URLS } from "../../../services/apiEndpoints";
import { useCallback, useEffect, useState } from "react";

import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import ActionBtn from "../../../shared/ActionBtn/ActionBtn";

export default function FacilitiesList() {
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(1);
  const [facilities, setFacilities] = useState<FacilityType[]>([]);
  const [facilitiesCount, setFacilitiesCount] = useState(0);
  const getAllFacilities = useCallback(
    async (pageSizeValue = pageSize, page = pageNumber) => {
      try {
        const response = await axiosInstance.get(
          ADMIN_URLS.ROOM.GET_ROOM_FACILITIES,
          {
            params: {
              size: pageSizeValue,
              page: page,
            },
          },
        );
        console.log(response.data.data);
        setFacilities(response.data.data.facilities);
        setFacilitiesCount(response.data.data.totalCount);
        // setTotalNumberOfRecords(response.data.totalNumberOfRecords);
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error);
          toast.error(error?.response?.data.message || "Something went wrong!");
        }
      }
    },
    [pageNumber, pageSize],
  );
  //  =================== sweetalert2  =====================

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "mui-confirm-btn",
      cancelButton: "mui-cancel-btn",
    },
    buttonsStyling: false,
  });
  //============deleteFacility =============
   const deleteFacility = async (id: string | null) => {
    if (!id) return;
    try {
      await axiosInstance.delete(ADMIN_URLS.ROOM.DELETE_ROOM_FACILITY(id));
      toast.success("Facility Deleted successfully");
      getAllFacilities(); // Refresh the list after deletion
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error("Error deleting facility:", error);
    }
  };

  //==================  useEffect facilities ===========
  useEffect(() => {
    getAllFacilities();
  }, [pageSize, pageNumber]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          my: 2,
        }}
      >
        <SectionTitle title="Facilities Table Details" />
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          sx={{
            textTransform: "none",
            borderRadius: "7px",
            backgroundColor: "#3F5FFF",
            "&:hover": {
              backgroundColor: "#2d44d2",
            },
          }}
        >
          {" "}
          Add New Facility{" "}
        </Button>
      </Box>

      {/* ======= Table ========== */}
      <Paper
        sx={{
          // my: "1rem",
          width: "100%",
          overflow: "hidden",
          borderRadius: "12px",
          boxShadow: 2,
        }}
      >
        <TableContainer sx={{ maxHeight: "calc(100vh - 320px)" }}>
          <Table stickyHeader aria-label="facilities table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Facility Name</TableCell>
                <TableCell align="center">Created By</TableCell>
                <TableCell align="center">Created At</TableCell>
                <TableCell align="center">Updated At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facilities.map((facility, index) => (
                <TableRow
                  key={facility._id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#F8F9FB" : "#ffffff",
                  }}
                >
                  <TableCell align="center">{facility.name}</TableCell>
                  <TableCell align="center">
                    {facility.createdBy?.userName || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(facility.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    {new Date(facility.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell align="center">
                    <ActionBtn
                      onEdit={() => {
                        // setSelectedFacility(facility);
                        // setAddFormTitle("Update Facility");
                        // setShowCardForm(true);
                        // setErrorMessage(null);
                      }}
                      onDelete={() =>
                        swalWithBootstrapButtons
                          .fire({
                            title: "Are you sure?",
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes, delete it!",
                            cancelButtonText: "No, cancel!",
                            reverseButtons: true,
                          })
                          .then((result) => {
                            if (result.isConfirmed) {
                              deleteFacility(facility._id);
                              swalWithBootstrapButtons.fire({
                                title: "Deleted!",
                                text: "The facility has been deleted.",
                                icon: "success",
                              });
                              //} else if (
                              //   // result.dismiss === Swal.DismissReason.cancel
                              // ) {
                              swalWithBootstrapButtons.fire({
                                title: "Cancelled",
                                text: "Your facility data is safe :)",
                                icon: "error",
                              });
                            }
                          })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25, 50, 100]}
          component="div"
          count={facilitiesCount}
          rowsPerPage={pageSize}
          page={pageNumber}
          onPageChange={(_, newPage) => setPageNumber(newPage + 1)}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPageNumber(1);
          }}
        />
      </Paper>
    </>
  );
}
