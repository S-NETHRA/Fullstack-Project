import StatusBadge from './StatusBadge';
import '../styles/RoomCard.css';

const RoomCard = ({ room, onBookClick, onStartClass, onEndClass, userRole }) => {
  const renderActions = () => {
    if (userRole === 'student' && room.status === 'Free') {
      return (
        <button 
          className="btn btn-primary"
          onClick={() => onBookClick && onBookClick(room)}
        >
          Request Booking
        </button>
      );
    }

    if (userRole === 'faculty') {
      if (room.status === 'Free') {
        return (
          <button 
            className="btn btn-success"
            onClick={() => onStartClass && onStartClass(room)}
          >
            Start Class
          </button>
        );
      } else {
        return (
          <button 
            className="btn btn-danger"
            onClick={() => onEndClass && onEndClass(room)}
          >
            End Class
          </button>
        );
      }
    }

    return null;
  };

  return (
    <div className="room-card">
      <div className="room-card-header">
        <h3 className="room-number">{room.roomNumber}</h3>
        <StatusBadge status={room.status} />
      </div>

      <div className="room-card-body">
        <div className="room-info">
          <div className="info-item">
            <span className="info-label">Building:</span>
            <span className="info-value">{room.building}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Floor:</span>
            <span className="info-value">{room.floor}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Capacity:</span>
            <span className="info-value">{room.capacity} seats</span>
          </div>
        </div>

        {room.equipment && room.equipment.length > 0 && (
          <div className="room-equipment">
            <span className="info-label">Equipment:</span>
            <div className="equipment-tags">
              {room.equipment.map((item, index) => (
                <span key={index} className="equipment-tag">{item}</span>
              ))}
            </div>
          </div>
        )}

        {room.status === 'Occupied' && room.currentClass && (
          <div className="current-class">
            <span className="info-label">Current Class:</span>
            <span className="class-name">{room.currentClass}</span>
            {room.assignedTo && (
              <span className="assigned-to">by {room.assignedTo}</span>
            )}
          </div>
        )}
      </div>

      {renderActions() && (
        <div className="room-card-footer">
          {renderActions()}
        </div>
      )}
    </div>
  );
};

export default RoomCard;
