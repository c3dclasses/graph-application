import CGraphEdge from "../cgraph/cgraphedge";

// add a draw method to CGraphEdge objects
CGraphEdge.prototype.draw = function(cgraphics) {
	var ed = this.getData();
	if(this.isMultiEdge())
		return;
	var vd1 = this.getCGraphVertex1().getData();
	var vd2 = this.getCGraphVertex2().getData();
	cgraphics.drawLine(vd1.m_x, vd1.m_y, vd2.m_x, vd2.m_y, ed.getWidth(), ed.m_color);
	return;
}
