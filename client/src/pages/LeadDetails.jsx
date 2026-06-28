import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

export default function LeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteText, setNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleApiError = (err) => {
    if (err.response?.status === 401) {
      logout();
      navigate('/login');
      return true;
    }
    return false;
  };

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await api.get(`/leads/${id}`);
        setLead(data);
      } catch (err) {
        if (handleApiError(err)) return;
        if (err.response?.status === 404) {
          setError('Lead not found');
        } else {
          setError('Failed to load lead');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true);
    setStatusMsg('');
    try {
      const { data } = await api.patch(`/leads/${id}/status`, { status: newStatus });
      setLead(data);
      setStatusMsg('Updated');
      setTimeout(() => setStatusMsg(''), 2000);
    } catch (err) {
      if (handleApiError(err)) return;
      setError('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setSubmittingNote(true);
    try {
      const { data } = await api.post(`/leads/${id}/notes`, { text: noteText });
      setLead(data);
      setNoteText('');
    } catch (err) {
      if (handleApiError(err)) return;
      setError('Failed to add note');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    api
      .delete(`/leads/${id}`)
      .then(() => navigate('/'))
      .catch((err) => {
        if (handleApiError(err)) return;
        setError('Failed to delete lead');
      });
  };

  if (loading) {
    return <p className="dashboard-message">Loading lead...</p>;
  }

  if (error === 'Lead not found') {
    return (
      <div className="lead-details">
        <p className="dashboard-message">Lead not found</p>
        <p style={{ textAlign: 'center', marginTop: 12 }}>
          <Link to="/">Back to Dashboard</Link>
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lead-details">
        <p className="dashboard-error">{error}</p>
        <p style={{ textAlign: 'center', marginTop: 12 }}>
          <Link to="/">Back to Dashboard</Link>
        </p>
      </div>
    );
  }

  if (!lead) return null;

  const sortedNotes = [...(lead.notes || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="lead-details">
      <Link to="/" className="back-link">&larr; Back to Dashboard</Link>

      <div className="lead-header">
        <h2>{lead.name}</h2>
        <span className={`status-badge status-${lead.status}`}>{lead.status}</span>
      </div>

      <div className="lead-info">
        <div className="info-row"><span className="info-label">Email</span><span>{lead.email}</span></div>
        <div className="info-row"><span className="info-label">Phone</span><span>{lead.phone || '—'}</span></div>
        <div className="info-row"><span className="info-label">Source</span><span>{lead.source}</span></div>
        <div className="info-row"><span className="info-label">Created</span><span>{new Date(lead.createdAt).toLocaleString()}</span></div>
        <div className="info-row"><span className="info-label">Updated</span><span>{new Date(lead.updatedAt).toLocaleString()}</span></div>
      </div>

      <div className="section">
        <h3>Status</h3>
        <div className="status-control">
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={statusUpdating}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
          {statusUpdating && <span className="updating-spinner">updating...</span>}
          {statusMsg && <span className="status-msg">{statusMsg}</span>}
        </div>
      </div>

      <div className="section">
        <h3>Notes</h3>
        {sortedNotes.length === 0 ? (
          <p className="no-notes">No notes yet</p>
        ) : (
          <ul className="notes-list">
            {sortedNotes.map((note, i) => (
              <li key={note._id || i} className="note-item">
                <p className="note-text">{note.text}</p>
                <span className="note-date">{new Date(note.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="add-note">
          <textarea
            placeholder="Add a note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
          />
          <button onClick={handleAddNote} disabled={submittingNote || !noteText.trim()}>
            {submittingNote ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </div>

      <div className="section">
        <button className="delete-btn" onClick={handleDelete}>Delete Lead</button>
      </div>
    </div>
  );
}
