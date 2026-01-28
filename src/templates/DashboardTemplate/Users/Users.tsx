import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { axiosInstance } from '../../../services/axiosInstance';
import { ADMIN_URLS } from '../../../services/apiEndpoints';


interface User {
  _id: string;  
  userName: string;
  email: string;
  phoneNumber: string;
  country: string;
  profileImage: string;
}

interface Column {
  id: keyof User; 
  label: string;
  minWidth: number;
  align?: 'left' | 'center' | 'right';
}

export default function Users() {
 
  const [Users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(0); 
  const [size, setSize] = useState<number>(10); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [totalCount, setTotalCount] = useState<number>(0); 

 
  const columns: Column[] = [
    { id: 'userName', label: 'User Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 100 },
    { id: 'phoneNumber', label: 'Phone Number', minWidth: 150 },
    { id: 'country', label: 'Country', minWidth: 100 },
    { id: 'profileImage', label: 'Profile Image', minWidth: 170 },
  ];


  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0); 
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(ADMIN_URLS.USER.GET_ALL_USERS, {
          params: { page: page + 1, size: size }, 
            headers: {
    'Cache-Control': 'no-cache',   
    'Pragma': 'no-cache',         
  },
        });

        console.log('Response data:', response.data); 

        const usersData = Array.isArray(response.data.data.users) ? response.data.data.users : [];
        if (usersData.length === 0) {
          console.error('No users data available');
        }
        setUsers(usersData); 
        setTotalCount(response.data.data.totalCount || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size]);
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'} 
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              Users.map((user) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={user._id}> 
                    {columns.map((column) => {
                      const value = user[column.id]; 
                      return (
                        <TableCell key={column.id} align={column.align || 'left'}>
                          {column.id === 'profileImage' ? (
                            <img
                              src={value || 'https://via.placeholder.com/50'}
                              alt="Profile"
                              width="50"
                              height="50"
                            />
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalCount} 
        rowsPerPage={size} 
        page={page} 
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage} 
          sx={{
    position: 'fixed',
    bottom: 0,
 
    backgroundColor: 'white',
    zIndex: 1000, 
  }}
      />
    </Paper>
  );
}
