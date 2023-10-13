import React from 'react';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { getProfileImage } from '../../service/api';
import Typography from '@mui/material/Typography';
import { Avatar, AvatarGroup, CardHeader, Link } from '@mui/material';
import useAvatar from '../../assets/images/UserAvatar.png';
import ProfileAvatar from './Avatar.jsx';
import rightArrow from '../../assets/images/right-arrow.svg'

const XICards1 = ({ data, onClick }) => {
    const [showAvatar, setShowAvatar] = React.useState(true);
    const [selectedCardIndex, setSelectedCardIndex] = React.useState(-1);
    const [cardValue, setCardValue] = React.useState('');


    const handleCardClick = (index, item) => {
        onClick(item);
        if (selectedCardIndex === index) {
            setShowAvatar(!showAvatar);
        } else {
            setSelectedCardIndex(index);
            setShowAvatar(false);
        }
    };
    return (
        <>
                <Card
                    
                    className="border border-gray-300 mt-8 rounded-md"
                    style={{
                        borderRadius: "10px",
                            
                    }}
                    onClick={() => handleCardClick()}
                >
                    <CardContent className="flex justify-between items-center" >
                        <div>
                            <Typography className="font-medium-500 text-sm">
                                dfsdfds
                            </Typography>
                            <Typography className="text-gray-400 text-xs">
                                This panel contains  experts
                            </Typography>
                        </div>
                        <AvatarGroup  max={2} className="w-12 h-8">
                            {showAvatar ? (
                                <ProfileAvatar  />
                            ) : (
                                <img src={rightArrow} alt="right arrow" className="h-3" />
                            )}
                        </AvatarGroup>
                    </CardContent>
                </Card>
        </>
    );
};

export default XICards1;
