import { extend, map, filter, reduce } from "lodash";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import useMedia from "use-media";
import EditInPlace from "@/components/EditInPlace";
import FavoritesControl from "@/components/FavoritesControl";
import { QueryTagsControl } from "@/components/tags-control/TagsControl";
import getTags from "@/services/getTags";
import useQueryFlags from "@/pages/queries/hooks/useQueryFlags";
import useArchiveQuery from "@/pages/queries/hooks/useArchiveQuery";
import usePublishQuery from "@/pages/queries/hooks/usePublishQuery";
import useUnpublishQuery from "@/pages/queries/hooks/useUnpublishQuery";
import useUpdateQueryTags from "@/pages/queries/hooks/useUpdateQueryTags";
import useRenameQuery from "@/pages/queries/hooks/useRenameQuery";
import useDuplicateQuery from "@/pages/queries/hooks/useDuplicateQuery";
import useApiKeyDialog from "@/pages/queries/hooks/useApiKeyDialog";
import usePermissionsEditorDialog from "@/pages/queries/hooks/usePermissionsEditorDialog";
import useQuery from "@/pages/queries/hooks/useQuery";

import "./DatasetEditHeader.less";

function getQueryTags() {
  return getTags("api/queries/tags").then(tags => map(tags, t => t.name));
}

export default function DatasetEditHeader({
  query,
  dataSource,
  headerExtra,
  tagsExtra,
  onChange,
  executeQuery,
  isQuerySaving,
  doSaveQuery
}) {
  const isDesktop = useMedia({ minWidth: 768 });
  const queryFlags = useQueryFlags(query, dataSource);
  const updateName = useRenameQuery(query, onChange);
  const updateTags = useUpdateQueryTags(query, onChange);
  const publishQuery = usePublishQuery(query, onChange);
  const unpublishQuery = useUnpublishQuery(query, onChange);
  const [isDuplicating, duplicateQuery] = useDuplicateQuery(query);
  const openApiKeyDialog = useApiKeyDialog(query, onChange);
  const openPermissionsEditorDialog = usePermissionsEditorDialog(query);

  
  console.log('头部组件', query);

  return (
    <div className="query-page-header dataset-edit-header">
      <div className="title-with-tags">
        <div className="page-title">
          <div className="d-flex align-items-center">
            {!queryFlags.isNew && <FavoritesControl item={query} />}
            <h3>
              <EditInPlace isEditable={queryFlags.canEdit} onDone={updateName} ignoreBlanks value={query.name} />
            </h3>
          </div>
        </div>
        <div className="query-tags">
          <QueryTagsControl
            tags={query.tags}
            isDraft={queryFlags.isDraft}
            isArchived={queryFlags.isArchived}
            canEdit={queryFlags.canEdit}
            getAvailableTags={getQueryTags}
            onEdit={updateTags}
            tagsExtra={tagsExtra}
          />
        </div>
      </div>
      <div className="header-actions">
        {headerExtra}
        <Button type="dashed" className="m-r-5" onClick={executeQuery}>
          <i className="fa fa-table m-r-5" /> 查看数据
        </Button>
        <Button type="primary" className="m-r-5" loading={isQuerySaving} onClick={doSaveQuery}>
          <i className="fa fa-floppy-o m-r-5" /> 保存
        </Button>
        {isDesktop && queryFlags.isDraft && !queryFlags.isArchived && !queryFlags.isNew && queryFlags.canEdit && (
          <Button className="m-r-5" onClick={publishQuery}>
            <i className="fa fa-paper-plane m-r-5" /> {__("Publish")}
          </Button>
        )}
      </div>
    </div>
  );
}

DatasetEditHeader.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  dataSource: PropTypes.object,
  sourceMode: PropTypes.bool,
  selectedVisualization: PropTypes.number,
  headerExtra: PropTypes.node,
  tagsExtra: PropTypes.node,
  onChange: PropTypes.func,
};

DatasetEditHeader.defaultProps = {
  dataSource: null,
  sourceMode: false,
  selectedVisualization: null,
  headerExtra: null,
  tagsExtra: null,
  onChange: () => { },
};
