import { ProfileSequences } from "../libs/cgraphicsgraph/cgraphicsgraphvertex"; 

ProfileSequences.forEach((ps, i) => { ps.m_bshow = localStorage.getItem("ProfileSequences[" + i + "].m_bshow") === 'true'; })

const GraphApplicationState = {
   m_profilesequences: ProfileSequences,
   m_bheader: true,
   m_bleftsidebar: true,
   m_brightsidebar: true,
   m_bshowgrid: false,
   m_vradius: 10,
   m_ewidth: 3,
       
   // m_cgraphicsgraph: null,
   // m_labeltype: localStorage.getItem("label-type") || "letters",
   // m_profiletype: localStorage.getItem("profile-type") || "none",
   m_bshowgrid: false,
   m_ngridrows: 3,
   m_ngridcols: 3,
   /// m_vradius: localStorage.getItem("m_vradius") || 16,
   // m_ewidth: localStorage.getItem("m_ewidth") || 5,
   // m_bshowloadspinner: true,
   // m_loadspinnermsg:"",
   // m_profiles: {
   //     m_bshort: localStorage.getItem("m_bshort") === 'true',
   //     m_sequences:ProfileSequences
   // },
   // m_bleftsidebar: localStorage.getItem("m_bleftsidebar") === 'true',
   // m_brightsidebar: localStorage.getItem("m_brightsidebar") === 'true'
}
export default GraphApplicationState;