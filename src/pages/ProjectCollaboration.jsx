import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, MapPin, Code, BookOpen, Target, Edit, Trash2, UserPlus, Link as LinkIcon, GitBranch } from 'lucide-react';
import api from '../services/api';

const CATEGORY_OPTIONS = [
  'hackathon',
  'academic',
  'research',
  'startup',
  'competition',
  'other',
];
const LOCATION_OPTIONS = ['on-campus', 'remote', 'hybrid'];

const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  category: '',
  skills: '',
  teamSizeMin: 1,
  teamSizeMax: '',
  technologies: '',
  githubLink: '',
  requirements: '',
  location: 'on-campus',
  deadline: '',
};

// Move modal OUTSIDE main component
const CreateProjectModal = ({ isOpen, onClose, formData, handleInputChange, handleSubmit, editProject }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{editProject ? 'Edit Project' : 'Create New Project'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Project Title *" required />
          <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Description *" required />
          <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" required>
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
          </select>
          <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Skills (comma separated)" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="teamSizeMin" value={formData.teamSizeMin} onChange={handleInputChange} min="1" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Min Team Size" required />
            <input type="number" name="teamSizeMax" value={formData.teamSizeMax} onChange={handleInputChange} min={formData.teamSizeMin} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Max Team Size" required />
          </div>
          <input type="text" name="technologies" value={formData.technologies} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Technologies (comma separated)" />
          <input type="url" name="githubLink" value={formData.githubLink} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="GitHub Link" />
          <select name="location" value={formData.location} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg">
            {LOCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
          </select>
          <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
          <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} rows="2" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Additional requirements or expectations..." />
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editProject ? 'Update Project' : 'Create Project'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectCollaboration = () => {
  const [projects, setProjects] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchAllProjects();
    fetchUserProjects();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const response = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(response.data.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchAllProjects = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const response = await api.get('/projects/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  // JOIN PROJECT FUNCTIONALITY
  const handleJoinProject = async (projectId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await api.post(`/projects/${projectId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllProjects();
      fetchUserProjects();
      alert('Successfully joined the project!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join project');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Please login to create a project');
        return;
      }
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        teamSize: {
          min: Number(formData.teamSizeMin),
          max: Number(formData.teamSizeMax),
        },
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        githubLink: formData.githubLink,
        requirements: formData.requirements,
        location: formData.location,
        deadline: formData.deadline || null,
      };
      if (editProject) {
        // Update
        const response = await api.put(`/projects/${editProject._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(prev => prev.map(p => p._id === editProject._id ? response.data.data : p));
        setUserProjects(prev => prev.map(p => p._id === editProject._id ? response.data.data : p));
        alert('Project updated successfully!');
      } else {
        // Create
        const response = await api.post('/projects', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(prev => [response.data.data, ...prev]);
        setUserProjects(prev => [response.data.data, ...prev]);
        alert('Project created successfully!');
      }
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await api.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(prev => prev.filter(p => p._id !== projectId));
      setUserProjects(prev => prev.filter(p => p._id !== projectId));
      alert('Project deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditProject(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const ProjectCard = ({ project }) => {
    const isOwner = currentUser && (project.owner?._id === currentUser._id || project.owner === currentUser._id);
    const teamSize = project.teamSize ? `${project.teamSize.min}–${project.teamSize.max}` : '';
    // Check if user is a member
    const isMember = Array.isArray(project.currentMembers) &&
      project.currentMembers.some(m => (m.user === currentUser?._id || m.user?._id === currentUser?._id));
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-800">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                <p className="text-sm text-gray-500">by {project.owner?.fullname || 'Unknown'}</p>
              </div>
            </div>
            {isOwner && (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditProject(project);
                    setFormData({
                      title: project.title,
                      description: project.description,
                      category: project.category,
                      skills: Array.isArray(project.skills) ? project.skills.join(', ') : '',
                      teamSizeMin: project.teamSize?.min || 1,
                      teamSizeMax: project.teamSize?.max || '',
                      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
                      githubLink: project.githubLink || '',
                      requirements: project.requirements || '',
                      location: project.location || 'on-campus',
                      deadline: project.deadline ? project.deadline.slice(0, 10) : '',
                    });
                    setIsCreateModalOpen(true);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
          <div className="mb-2 flex flex-wrap gap-2">
            {Array.isArray(project.skills) && project.skills.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">{skill}</span>
            ))}
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {Array.isArray(project.technologies) && project.technologies.map((tech, i) => (
              <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center"><GitBranch className="w-3 h-3 mr-1" />{tech}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span>Team: {teamSize}</span>
            </div>
            {project.deadline && (
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{project.location}</span>
            </div>
            {project.githubLink && (
              <div className="flex items-center text-gray-600">
                <LinkIcon className="w-4 h-4 mr-2" />
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="underline">GitHub</a>
              </div>
            )}
          </div>
          {project.requirements && (
            <div className="mb-2">
              <span className="font-semibold text-xs text-gray-700">Requirements: </span>
              <span className="text-xs text-gray-600">{project.requirements}</span>
            </div>
          )}
          {/* JOIN BUTTON */}
          {!isOwner && !isMember && (
            <button
              onClick={() => handleJoinProject(project._id)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center mt-2"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Join
            </button>
          )}
          {isMember && !isOwner && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full mt-2 inline-block">
              Joined
            </span>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Collaboration</h1>
            <p className="text-gray-600">Find teammates for your next big project</p>
          </div>
          <button onClick={() => {
            setEditProject(null);
            setFormData(INITIAL_FORM_DATA);
            setIsCreateModalOpen(true);
          }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center mt-4 sm:mt-0">
            <Plus className="w-5 h-5 mr-2" />Create Project
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Project</h2>
          <p className="text-gray-600 mb-6">Start a new project and find collaborators from your university</p>
          <button onClick={() => {
            setEditProject(null);
            setFormData(INITIAL_FORM_DATA);
            setIsCreateModalOpen(true);
          }} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center">
            <Plus className="w-5 h-5 mr-2" />Start New Project
          </button>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full font-medium">{userProjects.length} {userProjects.length === 1 ? 'project' : 'projects'}</span>
          </div>
          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map(project => (
                <div key={project._id} className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full font-medium">My Project</span>
                  </div>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
              <div className="text-gray-400 mb-4"><Code className="w-16 h-16 mx-auto" /></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">You haven't created or joined any projects yet. Start by creating your first project!</p>
              <button onClick={() => {
                setEditProject(null);
                setFormData(INITIAL_FORM_DATA);
                setIsCreateModalOpen(true);
              }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg">Create Your First Project</button>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Projects</h2>
          {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>)}
          {projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-gray-400 mb-4"><Code className="w-16 h-16 mx-auto" /></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">Be the first to create a project and find collaborators!</p>
              <button onClick={() => {
                setEditProject(null);
                setFormData(INITIAL_FORM_DATA);
                setIsCreateModalOpen(true);
              }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg">Create First Project</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (<ProjectCard key={project._id} project={project} />))}
            </div>
          )}
        </div>
        <CreateProjectModal isOpen={isCreateModalOpen} onClose={closeModal} formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} editProject={editProject} />
      </div>
    </div>
  );
};

export default ProjectCollaboration; 