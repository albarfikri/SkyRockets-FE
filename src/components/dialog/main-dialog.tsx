import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface MainDialogProps {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  singleButtonFullWidth?: {
    isEnabled: string;
    btnText: string;
    onClick: () => void;
  };
  singleButton?: {
    isEnabled: boolean;
    btnText: string;
    onClick: () => void;
  };
  doubleButton?: {
    isEnabled: string;
    firstBtnText: string;
    secondBtnText: string;
    onClickFirst: () => void;
    onClickSecond: () => void;
  },
  title: string,
}

export default function MainDialog({
  open,
  handleClose,
  children,
  singleButtonFullWidth,
  singleButton,
  doubleButton,
  title,
}: MainDialogProps) {
  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        {singleButton?.isEnabled && (
          <Button autoFocus onClick={singleButton.onClick}>
            {singleButton.btnText}
          </Button>
        )}
      </DialogActions>
    </BootstrapDialog>
  );
}
