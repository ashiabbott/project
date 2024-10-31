// src/components/Loading/Loading.tsx

import React from 'react';
import { CircularProgress } from '@mui/material';

const Loading: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <CircularProgress />
  </div>
);

export default Loading;
