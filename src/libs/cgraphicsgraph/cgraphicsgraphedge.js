import CGraphEdge from "../cgraph/cgraphedge";
import { collidePoint2LineSegment } from "../utility/utility";

// add a draw method to CGraphEdge objects
CGraphEdge.prototype.draw = function(cgraphics) {
	var ed = this.getData();
	if(this.isMultiEdge())
		return;
	var vd1 = this.getCGraphVertex1().getData();
	var vd2 = this.getCGraphVertex2().getData();
	ed.draw(cgraphics,vd1.m_x, vd1.m_y, vd2.m_x, vd2.m_y);
	return;
}

CGraphEdge.prototype.setSelected = function(bselected) { this.getData().setSelected(bselected); }

CGraphEdge.prototype.collide = function(x,y) { 
	var vdata1 = this.getCGraphVertex1().getData();
	var vdata2 = this.getCGraphVertex2().getData();
	var width = this.getData().getWidth();
	return collidePoint2LineSegment(x, y, vdata1.m_x, vdata1.m_y, vdata2.m_x, vdata2.m_y, width);
}