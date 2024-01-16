export const SETUNSEENCOUNT= 'SETUNSEENCOUNT';



export const setUnSeenCount = ({unSeenCount}) => {
 // console.log('action',unSeenCount)
  return {type:SETUNSEENCOUNT,payload:unSeenCount};
};





