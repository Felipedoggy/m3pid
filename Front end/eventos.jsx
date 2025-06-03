import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Badge } from 'react-bootstrap';

const colorOptions = [
  { color: '#3788d8', label: 'Azul' },
  { color: '#e74c3c', label: 'Vermelho' },
  { color: '#2ecc71', label: 'Verde' },
  { color: '#f39c12', label: 'Laranja' },
  { color: '#9b59b6', label: 'Roxo' },
];

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Componente principal da aplicação, responsável por renderizar o calendário, 
 * a lista de próximos eventos e o formulário para adicionar novos eventos.
 * 
 * @returns {JSX.Element} Elemento JSX do componente.
 */
/*******  78041856-4828-4c34-8a28-1f203ebbefda  *******/function App() {
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    color: '#3788d8',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    notify: false,
    notifyTime: '60',
    type: '',
  });

  const formRef = useRef();

  const api = axios.create({
    baseURL: 'http://localhost:3001', // altere se necessário
  });

  // Carregar eventos do back-end
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get('/eventos');
        setEvents(res.data);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
      }
    }
    fetchEvents();
  }, []);

  function handleEventClick(info) {
    const event = events.find((e) => e.id.toString() === info.event.id.toString());
    setSelectedEvent(event);
    setShowViewModal(true);
  }

  async function handleSaveEvent() {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    const start = new Date(formData.startDate + 'T' + formData.startTime);
    const end = new Date(formData.endDate + 'T' + formData.endTime);

    const newEvent = {
      title: formData.title,
      start: start.toISOString(),
      end: end.toISOString(),
      color: formData.color,
      location: formData.location,
      description: formData.description,
      notify: formData.notify,
      notifyTime: formData.notify ? parseInt(formData.notifyTime) : null,
      type: formData.type || 'Social',
    };

    try {
      const res = await api.post('/eventos', newEvent);
      setEvents([...events, res.data]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar evento:', err);
    }
  }

  async function handleDeleteEvent(id) {
    if (window.confirm('Deseja realmente excluir este evento?')) {
      try {
        await api.delete(`/eventos/${id}`);
        setEvents(events.filter((e) => e.id !== id));
      } catch (err) {
        console.error('Erro ao excluir evento:', err);
      }
    }
  }

  function resetForm() {
    setFormData({
      title: '',
      color: '#3788d8',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      notify: false,
      notifyTime: '60',
      type: '',
    });
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function getBadgeColor(type) {
    switch (type?.toLowerCase()) {
      case 'social':
        return 'primary';
      case 'educativo':
        return 'success';
      case 'celebração':
      case 'celebracao':
        return 'info';
      default:
        return 'secondary';
    }
  }

  const upcomingEvents = events
    .filter((e) => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="sidebar p-3"
        style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          height: '100vh',
          position: 'fixed',
          width: '250px',
        }}
      >
        <h4 className="m-0 mb-4">SATA</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Dashboard</a>
          </li>
          <li className="nav-item">
            <a className="nav-link active text-white" href="#">Eventos</a>
          </li>
        </ul>
      </div>

      {/* Conteúdo principal */}
      <div className="main-content flex-grow-1" style={{ marginLeft: '250px', padding: '20px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gerenciamento de Eventos</h2>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-circle"></i> Novo Evento
          </Button>
        </div>

        <div className="row mb-4">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  locale={ptBrLocale}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }}
                  events={events}
                  eventClick={handleEventClick}
                  height="auto"
                />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Próximos Eventos</h5>
              </div>
              <div className="card-body">
                {upcomingEvents.length === 0 && <p>Nenhum evento próximo.</p>}
                {upcomingEvents.map((ev) => (
                  <div key={ev.id} className="event-card card mb-3" style={{ borderLeft: `5px solid ${ev.color}` }}>
                    <div className="card-body">
                      <h5 className="card-title">{ev.title}</h5>
                      <p className="card-text mb-1">
                        <i className="bi bi-calendar-date"></i>{' '}
                        {new Date(ev.start).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="card-text mb-1">
                        <i className="bi bi-clock"></i>{' '}
                        {new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(ev.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="card-text">
                        <i className="bi bi-geo-alt"></i> {ev.location}
                      </p>
                      <div className="d-flex justify-content-end">
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteEvent(ev.id)}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Adicionar Evento */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Novo Evento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form ref={formRef}>
              <Form.Group>
                <Form.Label>Título</Form.Label>
                <Form.Control name="title" value={formData.title} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Cor</Form.Label>
                <Form.Select name="color" value={formData.color} onChange={handleInputChange}>
                  {colorOptions.map((opt) => (
                    <option key={opt.color} value={opt.color}>{opt.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Data e Hora de Início</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                  <Form.Control type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Data e Hora de Fim</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
                  <Form.Control type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Local</Form.Label>
                <Form.Control name="location" value={formData.location} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Descrição</Form.Label>
                <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Check label="Notificar antes do evento" name="notify" checked={formData.notify} onChange={handleInputChange} />
                {formData.notify && (
                  <Form.Control type="number" name="notifyTime" value={formData.notifyTime} onChange={handleInputChange} min={1} />
                )}
              </Form.Group>
              <Form.Group>
                <Form.Label>Tipo</Form.Label>
                <Form.Control name="type" value={formData.type} onChange={handleInputChange} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveEvent}>Salvar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default App;
