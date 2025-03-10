"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../DatabaseConfig/FirebaseConnect';
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Box } from '@mui/material';
import Details from './Details';
import { format } from 'date-fns';
import PersonIcon from '@mui/icons-material/Person';

const getOrdinalSuffix = (day) => {
  const j = day % 10;
  const k = day % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
};

const GetCheckin = ({ reload }) => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadfetch, setreload] = useState(true);
  const [selectedCheckin, setSelectedCheckin] = useState(null);

  useEffect(() => {
    const fetchCheckins = async () => {
      try {
        const response = await fetch('/api/getCheckin')
         const checkinList= await response.json()
        setCheckins(checkinList.data);
        setLoading(false);
      } catch (e) {
        console.error('Error fetching check-ins: ', e);
        setLoading(false);
      }
    };

    fetchCheckins();
  }, [reload])

  const handleCardClick = (checkin) => {
    setSelectedCheckin(checkin);
  };

  const handleCloseDetails = () => {
    setSelectedCheckin(null);
  };

  useEffect(() => {
    setreload(!reloadfetch)
    console.log('i am fetch comopnet')
  }, [reload])
  console.log(checkins)
  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  console.log(selectedCheckin);

  return (
    <div>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Added CheckIns
      </Typography>

      {selectedCheckin &&
        <Box>
          <Details checkin={selectedCheckin} close={handleCloseDetails} />
        </Box>
      }

      <Grid container spacing={1}>
        {checkins.length > 0 ? (
          checkins.map(checkin => (
            <Grid item xs={11} sm={5} md={3} key={checkin.id}>
              <Card onClick={() => handleCardClick(checkin)} sx={{ cursor: 'pointer', padding: 2, maxWidth: 313, borderRadius: 4, boxShadow: '14px 17px 40px 0px #00000021' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={checkin.imageUrl || "https://via.placeholder.com/150"}
                  alt={checkin.title}
                  sx={{ borderRadius: 6 }}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {checkin.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {
                      (() => {
                        const date = new Date(checkin.createdAt);
                        const day = format(date, 'd');
                        const month = format(date, 'MMMM');
                        const year = format(date, 'yyyy');
                        return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
                      })()
                    }
                  </Typography>
                  <Box display="flex" alignItems="center" sx={{ marginTop: 2 }}>
                    <PersonIcon sx={{ color: '#7B5AFF', marginRight: 1 }} />
                    <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>Owner: John</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No check-ins found</Typography>
        )}
      </Grid>
    </div>
  );
};

export default GetCheckin;
