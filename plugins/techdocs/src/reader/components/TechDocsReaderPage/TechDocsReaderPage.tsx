/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactNode, ReactChild, Children } from 'react';
import { useOutlet, useParams } from 'react-router-dom';

import { Page } from '@backstage/core-components';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { TECHDOCS_ADDONS_WRAPPER_KEY } from '@backstage/techdocs-addons';

import { TechDocsReaderPageRenderFunction } from '../../../types';

import { TechDocsReaderPageContent } from '../TechDocsReaderPageContent';
import { TechDocsReaderPageHeader } from '../TechDocsReaderPageHeader';
import { TechDocsReaderPageSubheader } from '../TechDocsReaderPageSubheader';

import { TechDocsReaderPageProvider } from './context';

type Extension = ReactChild & {
  type: {
    __backstage_data: {
      map: Map<string, boolean>;
    };
  };
};

export type TechDocsReaderLayoutProps = {
  withHeader?: boolean;
  withSearch?: boolean;
};

export const TechDocsReaderLayout = ({
  withSearch,
  withHeader = true,
}: TechDocsReaderLayoutProps) => {
  return (
    <>
      {withHeader && <TechDocsReaderPageHeader />}
      <TechDocsReaderPageSubheader />
      <TechDocsReaderPageContent withSearch={withSearch} />
    </>
  );
};

/**
 * @public
 */
export type TechDocsReaderPageProps = {
  entityRef?: CompoundEntityRef;
  children?: TechDocsReaderPageRenderFunction | ReactNode;
};

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * @public
 */
export const TechDocsReaderPage = ({
  entityRef,
  children,
}: TechDocsReaderPageProps) => {
  const { kind, name, namespace } = useParams();
  const route = useOutlet() || { props: { children: [] } };
  const entityName = entityRef ?? { kind, name, namespace };

  if (!children) {
    const outlet = Children.toArray(route.props.children);

    const page = outlet.find(child => {
      const { type } = child as Extension;
      return !type?.__backstage_data?.map?.get(TECHDOCS_ADDONS_WRAPPER_KEY);
    });

    return (
      (page as JSX.Element) || (
        <TechDocsReaderPageProvider entityName={entityName}>
          <Page themeId="documentation">
            <TechDocsReaderLayout />
          </Page>
        </TechDocsReaderPageProvider>
      )
    );
  }

  return (
    <TechDocsReaderPageProvider entityName={entityName}>
      {({ metadata, entityMetadata }) => (
        <Page themeId="documentation">
          {children instanceof Function
            ? children({
                entityRef: entityName,
                techdocsMetadataValue: metadata.value,
                entityMetadataValue: entityMetadata.value,
              })
            : children}
        </Page>
      )}
    </TechDocsReaderPageProvider>
  );
};