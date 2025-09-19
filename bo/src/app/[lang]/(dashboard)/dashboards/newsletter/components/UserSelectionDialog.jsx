import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, List, ListItem, ListItemText, FormControlLabel } from "@mui/material";
import { useState } from "react";

const UserSelectionDialog = ({ open, onClose, onConfirm, users }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);

  const handleToggle = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Choisir les destinataires</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={sendToAll}
              onChange={e => {
                setSendToAll(e.target.checked);
                if (e.target.checked) setSelectedUsers([]); // reset si "tous"
              }}
            />
          }
          label="Envoyer à tous les utilisateurs"
        />
        {!sendToAll && (
          <List>
            {users.map(user => (
              <ListItem key={user._id} button onClick={() => handleToggle(user._id)}>
                <Checkbox checked={selectedUsers.includes(user._id)} />
                <ListItemText sx={{fontSize: '13px'}} primary={user.name || user.email} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          variant="contained"
          onClick={() => onConfirm({ sendToAll, userIds: selectedUsers })}
          disabled={!sendToAll && selectedUsers.length === 0}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSelectionDialog;
